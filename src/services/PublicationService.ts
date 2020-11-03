import { Inject, Service } from "typedi";
import { Publication, PublicationType } from "@src/entity/Publication";
import { Arg } from "type-graphql";
import { CreatePublicationInput } from "@src/resolvers/publication/CreatePublicationInput";
import { UpdatePublicationInput } from "@src/resolvers/publication/UpdatePublicationInput";
import { FilterPublicationsInput } from "@src/resolvers/publication/FilterPublicationsInput";
import { getManager } from "typeorm";
import { PetService } from "@src/services/PetService";
import { ColorService } from "@src/services/ColorService";
import { PetGender, PetSize, PetType } from "@src/entity/Pet";
import { User } from "@src/entity/User";
import { GetMatchingsResponse } from "@src/resolvers/publication/GetMatchingsResponse";
import { FavoriteService } from "@src/services/FavoriteService";
import { Favorite } from "@src/entity/Favorite";
import { CreateUserFavoritePublication } from "@src/resolvers/publication/CreateUserFavoritePublication";
import { DeleteUserFavoritePublication } from "@src/resolvers/publication/DeleteUserFavoritePublication";
import { UbicationService } from "@src/services/UbicationService";
import { HeatPublicationsInput } from "@src/resolvers/publication/HeatPublicationsInput";
import { NotificationService } from "@src/services/NotificationService";

@Service()
export class PublicationService {
  @Inject(() => NotificationService)
  notificationService: NotificationService;
  @Inject(() => PetService)
  petService: PetService;
  @Inject(() => ColorService)
  colorService: ColorService;
  @Inject(() => FavoriteService)
  favoriteService: FavoriteService;
  @Inject(() => UbicationService)
  ubicationService: UbicationService;

  async create(
    @Arg("options", () => CreatePublicationInput)
    options: CreatePublicationInput
  ): Promise<Publication[]> {
    const {
      petData,
      additionalInfo,
      type,
      creatorId,
      ubicationData: { latitude, longitude },
      phoneNumber,
      reward,
    } = options;
    const pet = await this.petService.create(petData);
    const ubication = await this.ubicationService.create(latitude, longitude);
    const publication = await Publication.create({
      petId: pet.id,
      ubicationId: ubication.id,
      additionalInfo,
      type,
      creatorId,
      phoneNumber,
      reward,
    }).save();

    if (type === PublicationType.ADOPTION) {
      return [];
    }
    const { id } = publication;
    const {
      publicationsNotViewed,
      publicationsViewed,
    } = await this.getMatchings(id);
    const matchingArray = [...publicationsNotViewed, ...publicationsViewed];
    if (matchingArray.length) {
      const creatorsId = matchingArray.map(
        (publication) => publication.creatorId
      );
      await this.notificationService.sendNotificationToPublicationsCreators(
        id,
        creatorsId
      );
    }

    return matchingArray;
  }

  async delete(@Arg("id", () => String) id: string): Promise<Publication> {
    const deletedPublication = await Publication.findOne(id);
    if (!deletedPublication) throw new Error("Publication not found.");
    await Publication.delete(id);
    await this.petService.delete(deletedPublication.petId);
    await this.ubicationService.delete(deletedPublication.ubicationId);
    return deletedPublication;
  }

  async deleteAllFromUser({ id }: User): Promise<void> {
    const publications = await Publication.find({
      where: { creatorId: id },
    });
    for (const publication of publications) {
      await this.delete(publication.id);
    }
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePublicationInput) input: UpdatePublicationInput
  ): Promise<Publication> {
    await Publication.update({ id }, input);
    const updatedPublication = await Publication.findOne(id);
    if (!updatedPublication) throw new Error("Publication not found.");
    const petId = updatedPublication.petId;
    const ubicationId = updatedPublication.ubicationId;
    const { petData, ubicationData } = input;
    if (petData) {
      await this.petService.update(petId, petData);
    }
    if (ubicationData) {
      await this.ubicationService.update(ubicationId, ubicationData);
    }

    return updatedPublication;
  }

  async getHeatMapPublications(
    @Arg("options", () => HeatPublicationsInput)
    options: HeatPublicationsInput
  ): Promise<Publication[]> {
    const { publicationId, offset } = options;
    const { id, petId, ubicationId } = await this.getOne(publicationId);
    const {
      firstLatitude,
      firstLongitude,
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      locality,
    } = await this.ubicationService.getOne(ubicationId);
    const pet = await this.petService.getOne(petId);
    const maxLatitude = firstLatitude + offset;
    const minLatitude = firstLatitude - offset;
    const maxLongitude = firstLongitude + offset;
    const minLongitude = firstLongitude - offset;

    return Publication.createQueryBuilder("publication")
      .leftJoinAndSelect("publication.pet", "pet")
      .leftJoinAndSelect("publication.ubication", "ubication")
      .where(
        "publication.id <> :id AND publication.type = :publicationType AND pet.type = :petType",
        {
          id,
          petType: pet.type,
          publicationType: PublicationType.LOST,
        }
      )
      .andWhere(
        "ubication.country = :country AND ubication.administrativeAreaLevel1 = :administrativeAreaLevel1 AND ubication.administrativeAreaLevel2 = :administrativeAreaLevel2 AND ubication.locality = :locality",
        {
          country,
          administrativeAreaLevel1,
          administrativeAreaLevel2,
          locality,
        }
      )
      .andWhere(
        "ubication.firstLatitude >= :minLatitude AND ubication.firstLatitude <= :maxLatitude AND ubication.firstLongitude >= :minLongitude AND ubication.firstLongitude <= :maxLongitude",
        { maxLatitude, minLatitude, maxLongitude, minLongitude }
      )
      .andWhere(
        "ubication.lastLatitude is not null AND ubication.lastLongitude is not null"
      )
      .getMany();
  }

  async getFiltered(
    @Arg("options", () => FilterPublicationsInput)
    options: FilterPublicationsInput
  ): Promise<Publication[]> {
    const {
      petFilters,
      type,
      ubicationData: { latitude, longitude },
    } = options;
    const { gender, size } = petFilters;
    const {
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      locality,
    } = await this.ubicationService.getCurrent(latitude, longitude);

    const publicationType = type.length
      ? `AND publication.type IN (:...pubType)`
      : ``;
    const petTypeFilter = petFilters.type.length
      ? "AND pet.type IN (:...petType)"
      : "";
    const petGenderFilter = gender.length
      ? "AND pet.gender IN (:...petGender)"
      : "";
    const petSizeFilter =
      size.length && !petFilters.type.includes(PetType.CAT)
        ? "AND pet.size IN (:...petSize)"
        : "";

    return Publication.createQueryBuilder("publication")
      .leftJoinAndSelect("publication.pet", "pet")
      .leftJoinAndSelect("publication.ubication", "ubication")
      .where(
        `ubication.country = :country AND ubication.administrativeAreaLevel1 = :administrativeAreaLevel1 AND ubication.administrativeAreaLevel2 = :administrativeAreaLevel2 AND ubication.locality = :locality ${publicationType} ${petTypeFilter} ${petGenderFilter} ${petSizeFilter}`,
        {
          country,
          administrativeAreaLevel1,
          administrativeAreaLevel2,
          locality,
          pubType: type,
          petType: petFilters.type,
          petGender: gender,
          petSize: size,
        }
      )
      .orderBy("publication.createdAt", "DESC")
      .getMany();
  }

  async getOne(@Arg("id", () => String) id: string): Promise<Publication> {
    const publication = await Publication.findOne(id);
    if (!publication) throw new Error("Publication not found.");
    return publication;
  }

  searchSizes(
    @Arg("size", () => String)
    size: string
  ): String[] {
    switch (size) {
      case PetSize.VERY_SMALL:
        return [PetSize.VERY_SMALL, PetSize.SMALL];
      case PetSize.SMALL:
        return [PetSize.VERY_SMALL, PetSize.SMALL, PetSize.MEDIUM];
      case PetSize.MEDIUM:
        return [PetSize.SMALL, PetSize.MEDIUM, PetSize.LARGE];
      default:
        return [PetSize.MEDIUM, PetSize.LARGE];
    }
  }

  async getMatchings(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<GetMatchingsResponse> {
    const publication = await Publication.findOne(publicationId);
    if (!publication) throw new Error("Publication was not found.");
    const { id, ubicationId, petId, lastMatchingSearch } = publication;
    const pet = await this.petService.getOne(petId);
    const {
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      locality,
    } = await this.ubicationService.getOne(ubicationId);

    const publicationType =
      publication.type === PublicationType.FOUND
        ? [PublicationType.LOST]
        : [PublicationType.FOUND, PublicationType.ADOPTION];

    const petSizes = this.searchSizes(pet.size);

    const matchingPublications = await Publication.createQueryBuilder(
      "publication"
    )
      .leftJoinAndSelect("publication.pet", "pet")
      .leftJoinAndSelect("publication.ubication", "ubication")
      .where(
        "publication.id <> :id AND publication.type IN (:...publicationType)",
        { id, publicationType }
      )
      .andWhere(
        "pet.type = :petType AND pet.gender IN (:...petGender) AND pet.size IN (:...petSizes)",
        {
          petType: pet.type,
          petGender: [pet.gender, PetGender.UNDEFINED],
          petSizes,
        }
      )
      .andWhere(
        "ubication.country = :country AND ubication.administrativeAreaLevel1 = :administrativeAreaLevel1 AND ubication.administrativeAreaLevel2 = :administrativeAreaLevel2 AND ubication.locality = :locality ",
        {
          country,
          administrativeAreaLevel1,
          administrativeAreaLevel2,
          locality,
        }
      )
      .orderBy("publication.createdAt", "DESC")
      .getMany();

    let selectedPublications: Publication[] = [];

    matchingPublications.forEach((publication: Publication) => {
      let minimumDeltas = [];
      for (let i = 0; i < pet.color.length; i++) {
        let deltas: number[] = [];
        for (let j = 0; j < publication.pet.color.length; j++) {
          const deltaValue = this.colorService.getDeltaE(
            pet.color[i],
            publication.pet.color[j]
          );
          deltas.push(deltaValue);
        }
        const minimum = Math.min(...deltas);
        minimumDeltas.push(minimum);
      }
      if (minimumDeltas.some(this.colorService.similar)) {
        selectedPublications.push(publication);
      }
    });

    const lastViewed = (publication: Publication) => {
      return publication.createdAt.getTime() <= lastMatchingSearch.getTime();
    };
    const lastViewedIndex = selectedPublications.findIndex(lastViewed);
    const publicationsNotViewed = selectedPublications.slice(
      0,
      lastViewedIndex
    );
    const publicationsViewed = selectedPublications.slice(
      lastViewedIndex,
      selectedPublications.length
    );

    await this.update(publicationId, { lastMatchingSearch: new Date() });

    return { publicationsNotViewed, publicationsViewed };
  }

  async getUserPublications(id: String): Promise<Publication[]> {
    return Publication.find({
      where: { creatorId: id },
      order: { createdAt: "DESC" },
    });
  }

  async getUserFavoritePublications(userId: String): Promise<Publication[]> {
    return Publication.createQueryBuilder("publication")
      .leftJoinAndSelect("publication.userConnection", "favorite")
      .where("favorite.userId = :userId", { userId })
      .getMany();
  }

  async addUserFavoritePublication(
    options: CreateUserFavoritePublication
  ): Promise<Favorite> {
    return this.favoriteService.create(options);
  }

  async removeUserFavoritePublication(
    options: DeleteUserFavoritePublication
  ): Promise<Favorite> {
    return this.favoriteService.delete(options);
  }

  async addComplaint(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    const entityManager = getManager();
    const publication = await entityManager.findOne(Publication, id);
    if (!publication) throw new Error("Publication was not found.");
    publication.complaints = publication.complaints + 1;
    if (publication.complaints > 5) {
      // notificar administradores
    }
    return entityManager.save(publication);
  }
}
