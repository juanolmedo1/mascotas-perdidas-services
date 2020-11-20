import { InputType, Field } from "type-graphql";
import { Token } from "@src/entity/Token";

@InputType()
export class CreateTokenInput implements Partial<Token> {
  @Field()
  userId: string;

  @Field()
  token: string;
}
