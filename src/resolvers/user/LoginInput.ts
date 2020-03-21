import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  username: string;

  @Field()
  password: string;
}
