import { Field, ObjectType } from "type-graphql";
import { Ubication } from "@src/entity/Ubication";

@ObjectType()
export class GetUbicationOutput implements Partial<Ubication> {
  @Field()
  country: string;

  @Field()
  administrativeAreaLevel1: string;

  @Field()
  administrativeAreaLevel2: string;

  @Field()
  locality: string;

  @Field()
  firstLatitude: number;

  @Field()
  firstLongitude: number;
}
