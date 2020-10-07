import { InputType, Field } from "type-graphql";
import { PetType, PetGender, PetSize } from "@entity/Pet";

@InputType()
export class FilterPetInput {
  @Field(() => [String])
  type: PetType[];

  @Field(() => [String])
  gender: PetGender[];

  @Field(() => [String], { nullable: true })
  breed?: string;

  @Field(() => [String])
  size: PetSize[];

  @Field(() => [String], { nullable: true })
  color?: string[];
}
