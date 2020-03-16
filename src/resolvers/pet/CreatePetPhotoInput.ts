import { InputType, Field } from "type-graphql";
import { PetPhoto } from "@src/entity/PetPhoto";

@InputType()
export class CreatePetPhotoInput implements Partial<PetPhoto> {
  @Field()
  petId: string;

  @Field()
  data: string;

  @Field()
  type: string;
}
