import { InputType, Field } from "type-graphql";
import { PublicationType } from "@src/entity/Publication";
import { FilterPetInput } from "@resolvers/pet/FilterPetInput";

@InputType()
export class FilterPublicationsInput {
  @Field(() => [String], { nullable: true })
  type?: PublicationType[];

  @Field(() => FilterPetInput, { nullable: true })
  petFilters?: FilterPetInput;

  @Field()
  province: string;

  @Field()
  location: string;

  @Field(() => Boolean, { nullable: true })
  reward?: boolean;
}
