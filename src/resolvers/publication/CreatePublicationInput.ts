import { InputType, Field } from "type-graphql";
import { PublicationType, Publication } from "@src/entity/Publication";
import { CreatePetInput } from "@src/resolvers/pet/CreatePetInput";

@InputType()
export class CreatePublicationInput implements Partial<Publication> {
  @Field()
  creatorId: string;

  @Field(() => String)
  type: PublicationType;

  @Field(() => CreatePetInput)
  petData: CreatePetInput;

  @Field()
  province: string;

  @Field()
  location: string;

  @Field()
  phoneNumber: string;

  @Field(() => Boolean, { nullable: true })
  reward?: boolean;

  @Field(() => String, { nullable: true })
  additionalInfo?: string;
}
