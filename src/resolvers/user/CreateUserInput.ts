import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
}
