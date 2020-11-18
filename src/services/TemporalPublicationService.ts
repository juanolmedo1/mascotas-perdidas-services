import { Inject, Service } from "typedi";
import { TemporalPublication } from "@src/entity/TemporalPublication";
import { CreateTemporalPublicationInput } from "@src/resolvers/temporalPublication/CreateTemporalPublicationInput";
import { UbicationService } from "@src/services/UbicationService";
import { MLModelService } from "@src/services/MLModelService";
import { PetType } from "@src/entity/Pet";
import { MediaService } from "@src/services/MediaService";
import { PublicationService } from "@src/services/PublicationService";
import { GetMatchingsPublicationInput } from "@src/resolvers/temporalPublication/GetMatchingsPublicationInput";
import { NotificationService } from "@src/services/NotificationService";
import subDays from "date-fns/subDays";
import { LessThan } from "typeorm";

@Service()
export class TemporalPublicationService {
  @Inject(() => UbicationService)
  ubicationService: UbicationService;
  @Inject(() => MLModelService)
  MLModelService: MLModelService;
  @Inject(() => MediaService)
  mediaService: MediaService;
  @Inject(() => PublicationService)
  publicationService: PublicationService;
  @Inject(() => NotificationService)
  notificationService: NotificationService;

  transformType(type: string): PetType {
    switch (type) {
      case "cat":
        return PetType.CAT;
      case "dog":
        return PetType.DOG;
      default:
        return PetType.OTHER;
    }
  }

  async create(
    input: CreateTemporalPublicationInput
  ): Promise<TemporalPublication> {
    const { creatorId, ubicationData, photo } = input;
    const { type, breed } = await this.MLModelService.getTypeAndBreed(
      photo.data
    );
    const transformedType = this.transformType(type);
    const {
      id,
      country,
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      locality,
    } = await this.ubicationService.create(
      ubicationData.latitude,
      ubicationData.longitude
    );
    let petBreed = "unknown";
    if (breed.length) {
      petBreed = breed[0].label;
    }
    const image = await this.mediaService.uploadTemporalPublicationImage({
      data: photo.data,
      type: photo.type,
    });
    const temporalPublication = await TemporalPublication.create({
      creatorId,
      petType: transformedType,
      petBreed,
      petPhoto: image.url,
      petPhotoPublicId: image.public_id,
      ubicationId: id,
    }).save();

    const getMatchingsInput: GetMatchingsPublicationInput = {
      administrativeAreaLevel1,
      administrativeAreaLevel2,
      country,
      creatorId,
      locality,
      petBreed,
      petType: transformedType,
    };

    if (transformedType !== PetType.OTHER && petBreed !== "unknown") {
      const publications = await this.publicationService.getMatchingsWithTemporalPublication(
        getMatchingsInput
      );
      if (publications.length) {
        const creatorIds = publications.map(
          (publication) => publication.creatorId
        );
        await this.notificationService.sendTemporalPublicationNotification(
          temporalPublication.id,
          creatorIds
        );
      }
    }

    return temporalPublication;
  }

  async delete24hours(): Promise<void> {
    const limitDate = subDays(new Date(), 1);
    const temporalPublications = await TemporalPublication.find({
      where: { createdAt: LessThan(limitDate) },
    });
    for (const publication of temporalPublications) {
      await this.delete(publication.id);
    }
  }

  async delete(id: string): Promise<TemporalPublication> {
    const deletedTemporalPublication = await TemporalPublication.findOne(id);
    if (!deletedTemporalPublication)
      throw new Error("Temporal Publication not found");
    await this.notificationService.deleteNotificationsFromPublication(
      deletedTemporalPublication.id
    );
    await this.mediaService.deleteImage(
      deletedTemporalPublication.petPhotoPublicId
    );
    await TemporalPublication.delete(id);
    return deletedTemporalPublication;
  }

  async getOne(id: string): Promise<TemporalPublication> {
    const temporalPublication = await TemporalPublication.findOne(id);
    if (!temporalPublication) throw new Error("Temporal Publication not found");
    return temporalPublication;
  }
}
