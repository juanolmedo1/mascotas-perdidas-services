import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { User } from "@entity/User";
import { Publication } from "@entity/Publication";
import { CreateUserInput } from "@resolvers/user/CreateUserInput";
import { UpdateUserInput } from "@resolvers/user/UpdateUserInput";
import { Inject, Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { PublicationService } from "@src/services/PublicationService";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";
import { LoginInput } from "@resolvers/user/LoginInput";
import { AddNotificationTokenInput } from "@resolvers/user/AddNotificationTokenInput";
import { NotificationService } from "@src/services/NotificationService";
import { Notification } from "@src/entity/Notification";

@Service()
@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
  @Inject(() => UserService)
  userService: UserService;
  @Inject(() => PublicationService)
  publicationService: PublicationService;
  @Inject(() => ProfilePhotoService)
  profilePhotoService: ProfilePhotoService;
  @Inject(() => NotificationService)
  notificationService: NotificationService;

  @Mutation(() => User)
  async createUser(
    @Arg("options", () => CreateUserInput)
    options: CreateUserInput
  ): Promise<User> {
    return this.userService.create(options);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => User)
  async deleteUser(@Arg("id", () => String) id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Mutation(() => String)
  async addNotificationToken(
    @Arg("input", () => AddNotificationTokenInput)
    input: AddNotificationTokenInput
  ): Promise<String> {
    return this.userService.addNotificationToken(input);
  }

  @Query(() => User)
  async login(
    @Arg("options", () => LoginInput)
    options: LoginInput
  ): Promise<User> {
    return this.userService.login(options);
  }

  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Query(() => User)
  async getUser(
    @Arg("id", () => String) id: string
  ): Promise<User | undefined> {
    return this.userService.getOne(id);
  }

  @FieldResolver()
  async publications(@Root() user: User): Promise<Publication[]> {
    return this.publicationService.getUserPublications(user.id);
  }

  @FieldResolver()
  async profilePicture(@Root() user: User): Promise<ProfilePhoto> {
    return this.profilePhotoService.getOne(user.profilePictureId);
  }

  @FieldResolver()
  async notifications(@Root() user: User): Promise<Notification[]> {
    return this.notificationService.getUserNotifications(user.id);
  }
}
