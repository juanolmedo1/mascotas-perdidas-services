import { Resolver, Arg, Query } from "type-graphql";
import { Service } from "typedi";
import {
  UbicationService,
  Province,
  Location
} from "@src/services/UbicationService";

@Service()
@Resolver()
export class UbicationResolver {
  constructor(private ubicationService: UbicationService) {}

  @Query(() => [Province])
  async getProvinces(): Promise<Province[]> {
    return this.ubicationService.getProvinces();
  }

  @Query(() => [Province])
  async getLocations(
    @Arg("province", () => String) province: string
  ): Promise<Location[]> {
    return this.ubicationService.getLocations(province);
  }
}
