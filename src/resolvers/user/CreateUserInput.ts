import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  province: string;

  @Field()
  location: string;

  @Field()
  phoneNumber: string;

  @Field()
  dateOfBirth: string;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  photoData: string;
}
