import { Service } from "typedi";
import { Publication, PublicationType } from "@src/entity/Publication";
import { Arg } from "type-graphql";
import { CreatePublicationInput } from "@src/resolvers/publication/CreatePublicationInput";
import { UpdatePublicationInput } from "@src/resolvers/publication/UpdatePublicationInput";
import { FilterPublicationsInput } from "@src/resolvers/publication/FilterPublicationsInput";
import { getManager } from "typeorm";
import { User } from "@src/entity/User";
import { PetService } from "@src/services/PetService";
import { GetPublicationsInput } from "@src/resolvers/publication/GetPublicationsInput";
import { ColorService } from "@src/services/ColorService";
import { PetGender, PetSize, PetType } from "@src/entity/Pet";

@Service()
export class PublicationService {
  constructor(
    private petService: PetService,
    private colorService: ColorService
  ) {}

  async create(
    @Arg("options", () => CreatePublicationInput)
    options: CreatePublicationInput
  ): Promise<Publication[]> {
    const {
      petData,
      additionalInfo,
      type,
      creatorId,
      location,
      phoneNumber,
      province,
      reward
    } = options;
    const pet = await this.petService.create(petData);
    const publication = await Publication.create({
      petId: pet.id,
      additionalInfo,
      type,
      creatorId,
      location,
      phoneNumber,
      province,
      reward
    }).save();

    if (type === PublicationType.ADOPTION) {
      return [];
    }

    const { id } = publication;
    return this.getMatchings(id);
  }

  async delete(@Arg("id", () => String) id: string): Promise<Publication> {
    const deletedPublication = await Publication.findOne(id);
    if (!deletedPublication) throw new Error("Publication not found.");
    await Publication.delete(id);
    return deletedPublication;
  }

  async getAll(
    @Arg("options", () => GetPublicationsInput)
    options: GetPublicationsInput
  ): Promise<Publication[]> {
    const { province, location } = options;
    return Publication.find({
      where: { province, location },
      order: { createdAt: "DESC" }
    });
  }

  async update(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePublicationInput) input: UpdatePublicationInput
  ): Promise<Publication> {
    await Publication.update({ id }, input);
    const updatedPublication = await Publication.findOne(id);
    if (!updatedPublication) throw new Error("Publication not found.");
    const pet = await this.petService.getOne(updatedPublication.petId);
    if (!pet) throw new Error("Pet not found.");
    const { petData } = input;
    if (petData) {
      await this.petService.update(pet.id, petData);
    }

    return updatedPublication;
  }

  async getFiltered(
    @Arg("options", () => FilterPublicationsInput)
    options: FilterPublicationsInput
  ): Promise<Publication[]> {
    const { petFilters, province, location, type } = options;
    const { gender, size } = petFilters;

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
    // const petColorFilter = .color.length
    //     ? "AND pet.color IN (:...petColor)"
    //     : "";

    return Publication.createQueryBuilder("publication")
      .leftJoinAndSelect("publication.pet", "pet")
      .where(
        `publication.province = :province AND publication.location = :location ${publicationType} ${petTypeFilter} ${petGenderFilter} ${petSizeFilter}`,
        {
          province,
          location,
          pubType: type,
          petType: petFilters.type,
          petGender: gender,
          petSize: size
          // petColor: petFilters && petFilters.color
        }
      )
      .orderBy("publication.createdAt", "DESC")
      .getMany();
  }

  async getOne(
    @Arg("id", () => String) id: string
  ): Promise<Publication | undefined> {
    return Publication.findOne(id);
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
  ): Promise<Publication[]> {
    const publication = await Publication.findOne(publicationId);
    if (!publication) throw new Error("Publication was not found.");
    const { id, province, location, petId } = publication;
    const pet = await this.petService.getOne(petId);
    if (!pet) throw new Error("Pet was not found.");

    const publicationType =
      publication.type === PublicationType.FOUND
        ? [PublicationType.LOST]
        : [PublicationType.FOUND, PublicationType.ADOPTION];

    const petSizes = this.searchSizes(pet.size);

    const matchingPublications = await Publication.createQueryBuilder(
      "publication"
    )
      .leftJoinAndSelect("publication.pet", "pet")
      .where(
        "publication.id <> :id AND publication.province = :province AND publication.location = :location AND publication.type IN (:...publicationType)",
        { id, province, location, publicationType }
      )
      .andWhere(
        "pet.type = :petType AND pet.gender IN (:...petGender) AND pet.size IN (:...petSizes)",
        {
          petType: pet.type,
          petGender: [pet.gender, PetGender.UNDEFINED],
          petSizes
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
      if (this.colorService.isSimilar(minimumDeltas, pet.color.length)) {
        selectedPublications.push(publication);
      }
    });

    return selectedPublications;
  }

  async getUserPublications({ id }: User): Promise<Publication[]> {
    return Publication.find({ where: { creatorId: id } });
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
