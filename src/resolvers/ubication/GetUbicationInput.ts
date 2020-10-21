import { InputType, Field } from "type-graphql";

@InputType()
export class GetUbicationInput {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
