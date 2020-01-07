import { InputType, Field } from "type-graphql";
import {
  PublicationType,
  PetType,
  PetGenderType,
  Publication
} from "@src/entity/Publication";

@InputType()
export class FilterPublicationsInput implements Partial<Publication> {
  @Field(() => String, { nullable: true })
  type?: PublicationType;

  @Field(() => String, { nullable: true })
  pet?: PetType;

  @Field(() => String, { nullable: true })
  petGender?: PetGenderType;
}
