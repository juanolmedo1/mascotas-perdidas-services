import { InputType, Field } from "type-graphql";
import {
  PetCollarColor,
  PetSize,
  PetColor,
  PetType,
  PetGender,
  Pet
} from "@entity/Pet";

@InputType()
export class CreatePetInput implements Partial<Pet> {
  @Field(() => String)
  type: PetType;

  @Field(() => String)
  gender: PetGender;

  @Field(() => String)
  size: PetSize;

  @Field(() => String)
  color: PetColor;

  @Field(() => String)
  collar: PetCollarColor;

  @Field(() => [String])
  photosData: string[];
}
