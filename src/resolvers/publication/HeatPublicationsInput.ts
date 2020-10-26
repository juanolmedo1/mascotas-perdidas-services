import { InputType, Field } from "type-graphql";

@InputType()
export class HeatPublicationsInput {
  @Field(() => String)
  publicationId: string;

  @Field(() => Number)
  offset: number;
}
