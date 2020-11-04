import {
  Resolver,
  Query,
  Arg,
  FieldResolver,
  Root,
  ResolverInterface,
  Mutation,
} from "type-graphql";
import { Inject, Service } from "typedi";
import { Notification } from "@src/entity/Notification";
import { NotificationService } from "@src/services/NotificationService";
import { User } from "@src/entity/User";
import { UserService } from "@src/services/UserService";

@Service()
@Resolver(Notification)
export class NotificationResolver implements ResolverInterface<Notification> {
  @Inject(() => NotificationService)
  notificationService: NotificationService;
  @Inject(() => UserService)
  userService: UserService;

  @Query(() => [Notification])
  async getUserNotifications(
    @Arg("userId", () => String) userId: string
  ): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(userId);
  }

  @Query(() => Boolean)
  async sendNotificationNewPublication(
    @Arg("userIds", () => [String]) userIds: string[]
  ): Promise<Boolean> {
    await this.notificationService.sendNotificationNewPublication(userIds);
    return true;
  }

  @Mutation(() => Boolean)
  async sendNotification(
    @Arg("publicationId", () => String) publicationId: string,
    @Arg("creatorIds", () => [String]) creatorIds: string[]
  ): Promise<Boolean> {
    await this.notificationService.sendNotificationToPublicationsCreators(
      publicationId,
      creatorIds
    );
    return true;
  }

  @FieldResolver()
  async userCreator(@Root() notification: Notification): Promise<User> {
    return this.userService.getOne(notification.userCreatorId);
  }
}
