import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  Root,
  ResolverInterface
} from "type-graphql";
import { Publication } from "@entity/Publication";
import { User } from "@entity/User";
import { CreatePublicationInput } from "@resolvers/publication/CreatePublicationInput";
import { UpdatePublicationInput } from "@resolvers/publication//UpdatePublicationInput";
import { FilterPublicationsInput } from "@resolvers/publication//FilterPublicationsInput";
import { Service } from "typedi";
import { PublicationService } from "@src/services/PublicationService";
import { UserService } from "@src/services/UserService";
import { Photo } from "@src/entity/Photo";
import { PhotoService } from "@src/services/PhotoService";

@Service()
@Resolver(Publication)
export class PublicationResolver implements ResolverInterface<Publication> {
  constructor(
    private publicationService: PublicationService,
    private userService: UserService,
    private photoService: PhotoService
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

  @Query(() => [Publication])
  async getPublications(): Promise<Publication[]> {
    return this.publicationService.getAll();
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

  @Query(() => [Publication])
  async getMatchingPublications(
    @Arg("publicationId", () => String)
    publicationId: string
  ): Promise<Publication[]> {
    return this.publicationService.getMatchings(publicationId);
  }

  @FieldResolver()
  async creator(@Root() publication: Publication): Promise<User> {
    return this.userService.getCreator(publication);
  }

  @FieldResolver()
  async photos(@Root() publication: Publication): Promise<Photo[]> {
    return this.photoService.getAll(publication);
  }
}
