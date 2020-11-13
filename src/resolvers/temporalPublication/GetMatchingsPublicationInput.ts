import { PetType } from "@src/entity/Pet";
import { InputType, Field } from "type-graphql";

@InputType()
export class GetMatchingsPublicationInput {
  @Field()
  creatorId: string;

  @Field(() => PetType)
  petType: PetType;

  @Field()
  petBreed: string;

  @Field()
  country: string;

  @Field()
  administrativeAreaLevel1: string;

  @Field()
  administrativeAreaLevel2: string;

  @Field()
  locality: string;
}
