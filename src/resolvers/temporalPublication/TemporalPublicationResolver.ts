import {
  Resolver,
  Mutation,
  Arg,
  Query,
  FieldResolver,
  Root,
  ResolverInterface,
} from "type-graphql";
import { User } from "@entity/User";
import { Inject, Service } from "typedi";
import { UserService } from "@src/services/UserService";
import { UbicationService } from "@src/services/UbicationService";
import { Ubication } from "@src/entity/Ubication";
import { TemporalPublication } from "@src/entity/TemporalPublication";
import { TemporalPublicationService } from "@src/services/TemporalPublicationService";
import { CreateTemporalPublicationInput } from "@src/resolvers/temporalPublication/CreateTemporalPublicationInput";

@Service()
@Resolver(TemporalPublication)
export class TemporalPublicationResolver
  implements ResolverInterface<TemporalPublication> {
  @Inject(() => TemporalPublicationService)
  temporalPublicationService: TemporalPublicationService;
  @Inject(() => UserService)
  userService: UserService;
  @Inject(() => UbicationService)
  ubicationService: UbicationService;

  @Mutation(() => TemporalPublication)
  async createTemporalPublication(
    @Arg("input", () => CreateTemporalPublicationInput)
    input: CreateTemporalPublicationInput
  ): Promise<TemporalPublication> {
    return this.temporalPublicationService.create(input);
  }

  @Mutation(() => TemporalPublication)
  async deleteTemporalPublication(
    @Arg("id", () => String) id: string
  ): Promise<TemporalPublication> {
    return this.temporalPublicationService.delete(id);
  }

  @Query(() => TemporalPublication)
  async getTemporalPublication(
    @Arg("id", () => String) id: string
  ): Promise<TemporalPublication> {
    return this.temporalPublicationService.getOne(id);
  }

  @Mutation(() => Boolean)
  async delete24HoursTemporalPublications(): Promise<Boolean> {
    await this.temporalPublicationService.delete24hours();
    return true;
  }

  @FieldResolver()
  async creator(
    @Root() temporalPublication: TemporalPublication
  ): Promise<User> {
    return this.userService.getOne(temporalPublication.creatorId);
  }

  @FieldResolver()
  async ubication(
    @Root() temporalPublication: TemporalPublication
  ): Promise<Ubication> {
    return this.ubicationService.getOne(temporalPublication.ubicationId);
  }
}
