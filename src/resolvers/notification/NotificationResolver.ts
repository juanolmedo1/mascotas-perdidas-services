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

  @Mutation(() => Notification)
  async deleteNotification(
    @Arg("id", () => String) id: string
  ): Promise<Notification> {
    return this.notificationService.delete(id);
  }

  @FieldResolver()
  async userCreator(
    @Root() notification: Notification
  ): Promise<User | undefined> {
    if (notification.userCreatorId) {
      return this.userService.getOne(notification.userCreatorId);
    }
    return undefined;
  }
}
