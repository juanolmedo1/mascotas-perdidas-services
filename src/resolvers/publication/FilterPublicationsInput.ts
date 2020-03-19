import { InputType, Field } from "type-graphql";
import { PublicationType } from "@src/entity/Publication";
import { FilterPetInput } from "@resolvers/pet/FilterPetInput";

@InputType()
export class FilterPublicationsInput {
  @Field(() => [String])
  type: PublicationType[];

  @Field(() => FilterPetInput)
  petFilters: FilterPetInput;

  @Field()
  province: string;

  @Field()
  location: string;
}
