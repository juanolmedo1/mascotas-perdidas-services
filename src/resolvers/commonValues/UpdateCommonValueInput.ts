import { InputType, Field } from "type-graphql";
import { PetSize, PetGender } from "@entity/Pet";
import { CommonValues } from "@src/entity/CommonValues";

@InputType()
export class UpdateCommonValueInput implements Partial<CommonValues> {
  @Field()
  breed: string

  @Field(() => String, { nullable: true })
  gender?: PetGender;

  @Field(() => String, { nullable: true })
  size?: PetSize;

  @Field(() => String, { nullable: true })
  color?: string;
}
