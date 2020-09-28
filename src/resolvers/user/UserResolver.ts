import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  ResolverInterface,
  Root,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { User } from "@entity/User";
import { Publication } from "@entity/Publication";
import { CreateUserInput } from "@resolvers/user/CreateUserInput";
import { UpdateUserInput } from "@resolvers/user/UpdateUserInput";
import { Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { PublicationService } from "@src/services/PublicationService";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";
import { ProfilePhotoService } from "@src/services/ProfilePhotoService";
import { LoginInput } from "@resolvers/user/LoginInput";
import { LoginResponse } from "@src/auth/LoginResponse";
import AuthService from "@src/auth/AuthService";

@Service()
@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
  constructor(
    private userService: UserService,
    private publicationService: PublicationService,
    private profilePhotoService: ProfilePhotoService
  ) {}

  @Mutation(() => User)
  async createUser(
    @Arg("options", () => CreateUserInput)
    options: CreateUserInput
  ): Promise<User> {
    return this.userService.create(options);
  }

  @Mutation(() => User)
  @UseMiddleware(AuthService.isAuth)
  async updateUser(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdateUserInput) input: UpdateUserInput
  ): Promise<User> {
    return this.userService.update(id, input);
  }

  @Mutation(() => User)
  @UseMiddleware(AuthService.isAuth)
  async deleteUser(@Arg("id", () => String) id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Query(() => LoginResponse)
  async login(
    @Arg("options", () => LoginInput)
    options: LoginInput
  ): Promise<LoginResponse> {
    return this.userService.login(options);
  }

  @Query(() => [User])
  @UseMiddleware(AuthService.isAuth)
  async getUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Query(() => User)
  @UseMiddleware(AuthService.isAuth)
  async getUser(@Ctx("id") id: string): Promise<User> {
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
}
