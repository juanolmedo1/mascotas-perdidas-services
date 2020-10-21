import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  Root,
  ResolverInterface,
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
import { GetMatchingsResponse } from "@resolvers/publication/GetMatchingsResponse";
import { Favorite } from "@src/entity/Favorite";
import { CreateUserFavoritePublication } from "@resolvers/publication/CreateUserFavoritePublication";
import { DeleteUserFavoritePublication } from "@resolvers/publication/DeleteUserFavoritePublication";

@Service()
@Resolver(Publication)
export class PublicationResolver implements ResolverInterface<Publication> {
  constructor(
    private publicationService: PublicationService,
    private userService: UserService,
    private petService: PetService
  ) {}

  @Mutation(() => [Publication])
  async createPublication(
    @Arg("options", () => CreatePublicationInput)
    options: CreatePublicationInput
  ): Promise<Publication[]> {
    return this.publicationService.create(options);
  }

  @Mutation(() => Publication)
  async updatePublication(
    @Arg("id", () => String) id: string,
    @Arg("input", () => UpdatePublicationInput) input: UpdatePublicationInput
  ): Promise<Publication> {
    return this.publicationService.update(id, input);
  }

  @Mutation(() => Publication)
  async deletePublication(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    return this.publicationService.delete(id);
  }

  @Mutation(() => Publication)
  async addComplaint(
    @Arg("id", () => String) id: string
  ): Promise<Publication> {
    return this.publicationService.addComplaint(id);
  }

  @Mutation(() => Favorite)
  async addUserFavoritePublication(
    @Arg("options", () => CreateUserFavoritePublication)
    options: CreateUserFavoritePublication
  ): Promise<Favorite> {
    return this.publicationService.addUserFavoritePublication(options);
  }

  @Mutation(() => Favorite)
  async removeUserFavoritePublication(
    @Arg("options", () => DeleteUserFavoritePublication)
    options: DeleteUserFavoritePublication
  ): Promise<Favorite> {
    return this.publicationService.removeUserFavoritePublication(options);
  }

  @Query(() => Publication)
  async getPublication(
    @Arg("id", () => String) id: string
  ): Promise<Publication | undefined> {
    return this.publicationService.getOne(id);
  }

  @Query(() => [Publication])
  async getFilteredPublications(
    @Arg("options", () => FilterPublicationsInput)
    options: FilterPublicationsInput
  ): Promise<Publication[]> {
    return this.publicationService.getFiltered(options);
  }

  @Query(() => GetMatchingsResponse)
  async getMatchingPublications(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<GetMatchingsResponse> {
    return this.publicationService.getMatchings(publicationId);
  }

  @Query(() => [Publication])
  async getUserPublications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Publication[]> {
    return this.publicationService.getUserPublications(userId);
  }

  @Query(() => [Publication])
  async getUserFavoritePublications(
    @Arg("userId", () => String)
    userId: string
  ): Promise<Publication[]> {
    return this.publicationService.getUserFavoritePublications(userId);
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
