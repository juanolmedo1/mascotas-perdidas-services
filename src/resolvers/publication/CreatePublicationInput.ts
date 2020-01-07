import { InputType, Field } from "type-graphql";
import {
  PublicationType,
  PetType,
  PetGenderType,
  Publication
} from "@src/entity/Publication";

@InputType()
export class CreatePublicationInput implements Partial<Publication> {
  @Field()
  creatorId: string;

  @Field(() => String)
  type: PublicationType;

  @Field(() => String)
  pet: PetType;

  @Field(() => String)
  petGender: PetGenderType;

  @Field()
  province: string;

  @Field()
  location: string;

  @Field(() => [String])
  photosData: string[];
}
