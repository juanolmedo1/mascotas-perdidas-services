import { Service } from "typedi";
import axios from "axios";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Province {
  @Field()
  id: string;

  @Field()
  nombre: string;
}

interface GetProvinciasResponse {
  provincias: Province[];
}

@ObjectType()
export class Location {
  @Field()
  id: string;

  @Field()
  nombre: string;
}

interface GetLocationsResponse {
  localidades: Location[];
}

@Service()
export class UbicationService {
  private filters = "orden=nombre&campos=nombre";

  async getProvinces(): Promise<Province[]> {
    const result = await axios.get<GetProvinciasResponse>(
      `https://apis.datos.gob.ar/georef/api/provincias?${this.filters}`
    );
    const {
      data: { provincias }
    } = result;
    return provincias;
  }

  async getLocations(province: string): Promise<Location[]> {
    const result = await axios.get<GetLocationsResponse>(
      `https://apis.datos.gob.ar/georef/api/localidades?max=999&provincia=${province}&${this.filters}`
    );
    const {
      data: { localidades }
    } = result;
    return localidades;
  }
}
