import { Resolver, Arg, Query } from "type-graphql";
import { Service } from "typedi";
import { UbicationService } from "@src/services/UbicationService";
import { GetUbicationOutput } from "@resolvers/ubication/GetUbicationOutput";
import { Ubication } from "@src/entity/Ubication";

@Service()
@Resolver(Ubication)
export class UbicationResolver {
  constructor(private ubicationService: UbicationService) {}

  @Query(() => GetUbicationOutput)
  async getCurrentUbication(
    @Arg("lat", () => Number) lat: number,
    @Arg("lng", () => Number) lng: number
  ): Promise<GetUbicationOutput> {
    return this.ubicationService.getCurrent(lat, lng);
  }
}
