import { InputType, Field } from "type-graphql";

@InputType()
export class GetPublicationsInput {
  @Field()
  province: string;

  @Field()
  location: string;
}
