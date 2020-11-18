import { InputType, Field } from "type-graphql";
import { PetSize, PetGender } from "@entity/Pet";
import { CommonValues } from "@src/entity/CommonValues";

@InputType()
export class CreateCommonValueInput implements Partial<CommonValues> {
  @Field()
  breed: string

  @Field(() => String)
  gender: PetGender;

  @Field(() => String)
  size: PetSize;

  @Field(() => [String])
  color: string[];
}
