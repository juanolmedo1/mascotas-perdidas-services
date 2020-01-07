import { InputType, Field } from "type-graphql";
import { PublicationType, PetType, Publication } from "@src/entity/Publication";

@InputType()
export class UpdatePublicationInput implements Partial<Publication> {
  @Field(() => String, { nullable: true })
  type?: PublicationType;

  @Field(() => String, { nullable: true })
  pet?: PetType;
}
