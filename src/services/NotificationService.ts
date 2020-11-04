import * as admin from "firebase-admin";
import { Inject, Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";
import { PublicationService } from "@src/services/PublicationService";
import { PetPhotoService } from "@src/services/PetPhotoService";
import { Arg } from "type-graphql";
import { CreateNotificationInput } from "@src/resolvers/notification/CreateNotificationInput";
import { Notification, NotificationType } from "@src/entity/Notification";
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

  async getUserNotifications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Notification[]> {
    return Notification.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }

  async sendNotificationNewPublication(userIds: string[]): Promise<void> {
    let tokensArray = [];
    for (const id of userIds) {
      const user = await this.userService.getOne(id);
      const tokens = user.notificationTokens;
      if (tokens) {
        tokensArray.push(...tokens);
      }
    }
    if (tokensArray.length) {
      await admin.messaging().sendMulticast({
        tokens: tokensArray,
        data: {
          type: NotificationType.NEW_PUBLICATION,
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
        publicationId,
        userId: id,
        userCreatorId: publication.creatorId,
        type: NotificationType.POSSIBLE_MATCHING,
        photo: photo.data,
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
