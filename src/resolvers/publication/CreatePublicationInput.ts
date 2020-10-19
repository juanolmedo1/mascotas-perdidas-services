import { InputType, Field } from "type-graphql";
import { PublicationType, Publication } from "@src/entity/Publication";
import { CreatePetInput } from "@src/resolvers/pet/CreatePetInput";
import { CreateUbicationInput } from "@resolvers/ubication/CreateUbicationInput";

@InputType()
export class CreatePublicationInput implements Partial<Publication> {
  @Field()
  creatorId: string;

  @Field(() => String)
  type: PublicationType;

  @Field(() => CreatePetInput)
  petData: CreatePetInput;

  @Field(() => CreateUbicationInput)
  ubicationData: CreateUbicationInput;

  @Field()
  phoneNumber: string;

  @Field(() => Boolean, { nullable: true })
  reward?: boolean;

  @Field(() => String, { nullable: true })
  additionalInfo?: string;
}
