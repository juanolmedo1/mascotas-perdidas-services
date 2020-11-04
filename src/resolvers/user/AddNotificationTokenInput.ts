import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";

@InputType()
export class AddNotificationTokenInput implements Partial<User> {
  @Field()
  id: string;

  @Field()
  token: string;
}
