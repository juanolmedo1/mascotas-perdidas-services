import { InputType, Field } from "type-graphql";
import {
  PetGender,
  PetType,
  PetSize,
  PetCollarColor,
  PetColor,
  Pet
} from "@entity/Pet";

@InputType()
export class UpdatePetInput implements Partial<Pet> {
  @Field(() => String, { nullable: true })
  type?: PetType;

  @Field(() => String, { nullable: true })
  gender?: PetGender;

  @Field(() => String, { nullable: true })
  size?: PetSize;

  @Field(() => String, { nullable: true })
  color?: PetColor;

  @Field(() => String, { nullable: true })
  collar?: PetCollarColor;

  @Field(() => [String], { nullable: true })
  photosData?: string[];
}
