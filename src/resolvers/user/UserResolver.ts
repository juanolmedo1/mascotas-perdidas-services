import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  ResolverInterface,
  Root
} from "type-graphql";
import { User } from "@entity/User";
import { Publication } from "@entity/Publication";
import { CreateUserInput } from "@resolvers/user/CreateUserInput";
import { UpdateUserInput } from "@resolvers/user/UpdateUserInput";
import { Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { PublicationService } from "@src/services/PublicationService";

@Service()
@Resolver(User)
export class UserResolver implements ResolverInterface<User> {
  constructor(
    private userService: UserService,
    private publicationService: PublicationService
  ) {}

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
    return this.publicationService.getUserPublications(user);
  }
}
