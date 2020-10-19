import { InputType, Field } from "type-graphql";

@InputType()
export class CreateUbicationInput {
  @Field()
  latitude: number;

  @Field()
  longitude: number;
}
