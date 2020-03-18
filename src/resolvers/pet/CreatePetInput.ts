import { InputType, Field } from "type-graphql";
import { PetSize, PetType, PetGender, Pet } from "@entity/Pet";
import { CreatePhotoInput } from "@resolvers/photo/CreatePhotoInput";

@InputType()
export class CreatePetInput implements Partial<Pet> {
  @Field(() => String)
  type: PetType;

  @Field(() => String)
  gender: PetGender;

  @Field(() => String)
  size: PetSize;

  @Field(() => [String])
  color: string[];

  @Field()
  collar: boolean;

  @Field(() => [CreatePhotoInput])
  photosData: CreatePhotoInput[];
}
