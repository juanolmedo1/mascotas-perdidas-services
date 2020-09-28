import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  Root,
  ResolverInterface,
  UseMiddleware,
} from "type-graphql";
import { Publication } from "@entity/Publication";
import { User } from "@entity/User";
import { CreatePublicationInput } from "@resolvers/publication/CreatePublicationInput";
import { UpdatePublicationInput } from "@resolvers/publication//UpdatePublicationInput";
import { FilterPublicationsInput } from "@resolvers/publication//FilterPublicationsInput";
import { Service } from "typedi";
import { PublicationService } from "@src/services/PublicationService";
import { UserService } from "@src/services/UserService";
import { PetService } from "@src/services/PetService";
import { Pet } from "@src/entity/Pet";
import AuthService from "@src/auth/AuthService";
import { GetPublicationsInput } from "@resolvers/publication/GetPublicationsInput";
import { GetMatchingsResponse } from "@resolvers/publication/GetMatchingsResponse";

@Service()
@Resolver(Publication)
export class PublicationResolver implements ResolverInterface<Publication> {
  constructor(
    private publicationService: PublicationService,
    private userService: UserService,
    private petService: PetService
  ) {}

  @Mutation(() => [Publication])
  @UseMiddleware(AuthService.isAuth)
  async createPublication(
    @Arg("options", () => CreatePublicationInput)
    options: CreatePublicationInput
  ): Promise<Publication[]> {
    return this.publicationService.create(options);
  }

  @Mutation(() => Publication)
  @UseMiddleware(AuthService.isAuth)
  async updatePublication(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePublicationInput) input: UpdatePublicationInput
  ): Promise<Publication> {
    return this.publicationService.update(id, input);
  }

  @Mutation(() => Publication)
  @UseMiddleware(AuthService.isAuth)
  async deletePublication(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    return this.publicationService.delete(id);
  }

  @Mutation(() => Publication)
  @UseMiddleware(AuthService.isAuth)
  async addComplaint(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    return this.publicationService.addComplaint(id);
  }

  @Query(() => [Publication])
  @UseMiddleware(AuthService.isAuth)
  async getPublications(
    @Arg("options", () => GetPublicationsInput)
    options: GetPublicationsInput
  ): Promise<Publication[]> {
    return this.publicationService.getAll(options);
  }

  @Query(() => Publication)
  @UseMiddleware(AuthService.isAuth)
  async getPublication(
    @Arg("id", () => String) id: string
  ): Promise<Publication | undefined> {
    return this.publicationService.getOne(id);
  }

  @Query(() => [Publication])
  @UseMiddleware(AuthService.isAuth)
  async getFilteredPublications(
    @Arg("options", () => FilterPublicationsInput)
    options: FilterPublicationsInput
  ): Promise<Publication[]> {
    return this.publicationService.getFiltered(options);
  }

  @Query(() => GetMatchingsResponse)
  @UseMiddleware(AuthService.isAuth)
  async getMatchingPublications(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<GetMatchingsResponse> {
    return this.publicationService.getMatchings(publicationId);
  }

  @Query(() => [Publication])
  @UseMiddleware(AuthService.isAuth)
  async getUserPublications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Publication[]> {
    return this.publicationService.getUserPublications(userId);
  }

  @FieldResolver()
  async creator(@Root() publication: Publication): Promise<User> {
    return this.userService.getCreator(publication);
  }

  @FieldResolver()
  async pet(@Root() publication: Publication): Promise<Pet> {
    return this.petService.getOne(publication.petId);
  }
}
