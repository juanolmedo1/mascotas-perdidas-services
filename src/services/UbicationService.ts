import { Service } from "typedi";
import axios from "axios";
import { ObjectType, Field } from "type-graphql";
import { Ubication } from "@src/entity/Ubication";
import { GetUbicationOutput } from "@src/resolvers/ubication/GetUbicationOutput";
import { UpdateUbicationInput } from "@src/resolvers/ubication/UpdateUbicationInput";

@ObjectType()
export class AddressComponent {
  @Field()
  long_name: string;

  @Field()
  short_name: string;

  @Field(() => [String])
  types: string[];
}

@Service()
export class UbicationService {
  private GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

  async create(lat: number, lng: number): Promise<Ubication> {
    const currentUbication = await this.getCurrent(lat, lng);
    return Ubication.create(currentUbication).save();
  }

  async getOne(id: string): Promise<Ubication> {
    const ubication = await Ubication.findOne(id);
    if (!ubication) throw new Error("Ubication not found");
    return ubication;
  }

  async delete(id: string): Promise<Ubication> {
    const deletedUbication = await Ubication.findOne(id);
    if (!deletedUbication) throw new Error("Ubication not found");
    await Ubication.delete(id);
    return deletedUbication;
  }

  async update(id: string, input: UpdateUbicationInput): Promise<Ubication> {
    await Ubication.update({ id }, input);
    const updatedUbication = await Ubication.findOne(id);
    if (!updatedUbication) throw new Error("Ubication not found.");
    return updatedUbication;
  }

  async getCurrent(lat: number, lng: number): Promise<GetUbicationOutput> {
    const result = await axios.get<any>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=es-419&result_type=country|administrative_area_level_1|administrative_area_level_2|locality&key=${this.GOOGLE_API_KEY}`
    );
    if (result.data.status === "ZERO_RESULTS")
      throw new Error("Ubication not found");
    const addressComponents = result.data.results[0]
      .address_components as AddressComponent[];
    const countryObject = addressComponents.find((element) =>
      element.types.includes("country")
    );
    const adminArea1Object = addressComponents.find((element) =>
      element.types.includes("administrative_area_level_1")
    );
    const adminArea2Object =
      addressComponents.find((element) =>
        element.types.includes("administrative_area_level_2")
      ) || adminArea1Object;
    let localityObject =
      addressComponents.find((element) => element.types.includes("locality")) ||
      adminArea2Object;
    const ubication: GetUbicationOutput = {
      firstLatitude: lat,
      firstLongitude: lng,
      country: countryObject!.long_name,
      administrativeAreaLevel1: adminArea1Object!.long_name,
      administrativeAreaLevel2: adminArea2Object!.long_name,
      locality: localityObject!.long_name,
    };
    return ubication;
  }
}
