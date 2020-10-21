import { InputType, Field } from "type-graphql";
import { PublicationType, Publication } from "@src/entity/Publication";
import { UpdatePetInput } from "@resolvers/pet/UpdatePetInput";
import { UpdateUbicationInput } from "@resolvers/ubication/UpdateUbicationInput";

@InputType()
export class UpdatePublicationInput implements Partial<Publication> {
  @Field(() => String, { nullable: true })
  type?: PublicationType;

  @Field(() => UpdatePetInput, { nullable: true })
  petData?: UpdatePetInput;

  @Field(() => UpdateUbicationInput, { nullable: true })
  ubicationData?: UpdateUbicationInput;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => Boolean, { nullable: true })
  reward?: boolean;

  @Field(() => String, { nullable: true })
  additionalInfo?: string;

  @Field(() => Date, { nullable: true })
  lastMatchingSearch?: Date;
}
