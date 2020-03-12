import { InputType, Field } from "type-graphql";
import {
  PetType,
  PetGender,
  PetCollarColor,
  PetSize,
  PetColor
} from "@entity/Pet";

@InputType()
export class FilterPetInput {
  @Field(() => [String], { nullable: true })
  type?: PetType[];

  @Field(() => [String], { nullable: true })
  gender?: PetGender[];

  @Field(() => [String], { nullable: true })
  size?: PetSize[];

  @Field(() => [String], { nullable: true })
  color?: PetColor[];

  @Field(() => [String], { nullable: true })
  collar?: PetCollarColor[];
}
