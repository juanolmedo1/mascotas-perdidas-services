import * as admin from "firebase-admin";
import { Inject, Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";
import { PublicationService } from "@src/services/PublicationService";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Arg } from "type-graphql";
import { CreateNotificationInput } from "@src/resolvers/notification/CreateNotificationInput";
import { Notification, NotificationType } from "@src/entity/Notification";
import { TemporalPublicationService } from "@src/services/TemporalPublicationService";
import { Like } from "typeorm";
const serviceAccount = require("../../firebase-config.json");

@Service()
export class NotificationService {
  @Inject(() => PublicationService)
  publicationService: PublicationService;
  @Inject(() => UserService)
  userService: UserService;
  @Inject(() => ProfilePhotoService)
  profilePhotoService: ProfilePhotoService;
  @Inject(() => PetPhotoService)
  petPhotoService: PetPhotoService;
  @Inject(() => TemporalPublicationService)
  temporalPublicationService: TemporalPublicationService;

  constructor() {
    const { FIREBASE_DATABASE_URL } = process.env;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: FIREBASE_DATABASE_URL,
    });
  }

  async create(
    @Arg("input", () => CreateNotificationInput)
    input: CreateNotificationInput
  ): Promise<Notification> {
    return Notification.create(input).save();
  }

  async delete(id: string): Promise<Notification> {
    const deletedNotification = await Notification.findOne(id);
    if (!deletedNotification) throw new Error("Notification not found.");
    await Notification.delete(id);
    return deletedNotification;
  }

  async deleteNotificationsFromPublication(
    publicationId: string
  ): Promise<void> {
    const notifications = await Notification.find({
      where: { publicationId: Like(`%${publicationId}%`) },
    });
    for (const notification of notifications) {
      await this.delete(notification.id);
    }
  }

  async deleteAllFromUser(userId: string): Promise<void> {
    const notifications = await this.getUserNotifications(userId);
    const createdNotifications = await this.getUserCreatedNotifications(userId);
    const allNotifications = [...notifications, ...createdNotifications];
    for (const notification of allNotifications) {
      await this.delete(notification.id);
    }
  }

  async getUserCreatedNotifications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Notification[]> {
    return Notification.find({
      where: { userCreatorId: userId },
      order: { createdAt: "DESC" },
    });
  }

  async getUserNotifications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Notification[]> {
    return Notification.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async sendTemporalPublicationNotification(
    temporalPublicationId: string,
    userIds: string[]
  ): Promise<void> {
    const publication = await this.temporalPublicationService.getOne(
      temporalPublicationId
    );
    let tokensArray = [];
    const uniqueCreators = [...new Set(userIds)];
    for (const id of uniqueCreators) {
      const user = await this.userService.getOne(id);
      const createNotificationInput: CreateNotificationInput = {
        publicationId: [temporalPublicationId],
        userId: id,
        userCreatorId: publication.creatorId,
        type: NotificationType.TEMPORAL_PUBLICATION,
        photos: [publication.petPhoto],
      };
      await this.create(createNotificationInput);
      const tokens = user.notificationTokens;
      if (tokens) {
        tokensArray.push(...tokens);
      }
    }
    if (tokensArray.length) {
      await admin.messaging().sendMulticast({
        tokens: tokensArray,
        data: {
          type: NotificationType.TEMPORAL_PUBLICATION,
        },
        notification: {
          title: "¡Atención!",
          body: "Alguien vio una mascota que podría ser la tuya.",
        },
        android: {
          notification: {
            imageUrl: publication.petPhoto,
          },
        },
      });
    }
  }

  async sendDeletedPublicationNotification(id: string): Promise<void> {
    const publication = await this.publicationService.getOne(id);
    const photos = await this.petPhotoService.getPhotosByPetId(
      publication.petId
    );
    const user = await this.userService.getOne(publication.creatorId);
    const petPhotos = photos.map((photo) => photo.data);
    const notificationInput: CreateNotificationInput = {
      type: NotificationType.DELETED_FOR_COMPLAINTS,
      userId: user.id,
      photos: petPhotos,
    };
    await this.create(notificationInput);
    if (user.notificationTokens && user.notificationTokens.length) {
      await admin.messaging().sendMulticast({
        tokens: user.notificationTokens,
        data: {
          type: NotificationType.DELETED_FOR_COMPLAINTS,
        },
        notification: {
          title: "¡Atención!",
          body: "Un publicación suya fue eliminada.",
        },
        android: {
          notification: {
            imageUrl: petPhotos[0],
          },
        },
      });
    }
  }

  async sendDobleConfirmationNotification(
    userId: string,
    receiverPublicationId: string,
    senderPublicationId: string
  ): Promise<void> {
    const publication = await this.publicationService.getOne(
      senderPublicationId
    );
    const photo = await this.petPhotoService.getPhotoByPetId(publication.petId);
    const user = await this.userService.getOne(userId);
    const createNotificationInput: CreateNotificationInput = {
      publicationId: [receiverPublicationId, senderPublicationId],
      userId,
      userCreatorId: publication.creatorId,
      type: NotificationType.DOBLE_CONFIRMATION,
      photos: [photo.data],
    };
    await this.create(createNotificationInput);
    const userTokens = user.notificationTokens || [];
    if (userTokens.length) {
      await admin.messaging().sendMulticast({
        tokens: userTokens,
        data: {
          senderPublicationId,
        },
        notification: {
          title: "¡Atención!",
          body: "Una publicación tuya requiere confirmación.",
        },
        android: {
          notification: {
            imageUrl: photo.data,
          },
        },
      });
    }
  }

  async sendNotificationToPublicationsCreators(
    publicationId: string,
    creatorIds: string[]
  ): Promise<void> {
    const publication = await this.publicationService.getOne(publicationId);
    const photo = await this.petPhotoService.getPhotoByPetId(publication.petId);
    let tokensArray = [];
    const uniqueCreators = [...new Set(creatorIds)];
    for (const id of uniqueCreators) {
      const user = await this.userService.getOne(id);
      const createNotificationInput: CreateNotificationInput = {
        publicationId: [publicationId],
        userId: id,
        userCreatorId: publication.creatorId,
        type: NotificationType.POSSIBLE_MATCHING,
        photos: [photo.data],
      };
      await this.create(createNotificationInput);
      const tokens = user.notificationTokens;
      if (tokens) {
        tokensArray.push(...tokens);
      }
    }
    if (tokensArray.length) {
      await admin.messaging().sendMulticast({
        tokens: tokensArray,
        data: {
          publicationId,
          type: NotificationType.POSSIBLE_MATCHING,
        },
        notification: {
          title: "¡Posible Coincidencia!",
          body: "Detectamos una mascota que podría ser la suya.",
        },
        android: {
          notification: {
            imageUrl: photo.data,
          },
        },
      });
    }
  }
}
