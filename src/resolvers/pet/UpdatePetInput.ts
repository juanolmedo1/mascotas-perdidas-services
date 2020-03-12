import { InputType, Field } from "type-graphql";
import { PetGender, PetType, PetSize, Pet } from "@entity/Pet";

@InputType()
export class UpdatePetInput implements Partial<Pet> {
  @Field(() => String, { nullable: true })
  type?: PetType;

  @Field(() => String, { nullable: true })
  gender?: PetGender;

  @Field(() => String, { nullable: true })
  size?: PetSize;

  @Field(() => [String], { nullable: true })
  color?: string[];

  @Field(() => Boolean, { nullable: true })
  collar?: boolean;

  @Field(() => [String], { nullable: true })
  photosData?: string[];
}
