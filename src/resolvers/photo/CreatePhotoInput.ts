import { InputType, Field } from "type-graphql";

@InputType()
export class CreatePhotoInput {
  @Field()
  type: string;

  @Field()
  data: string;
}
