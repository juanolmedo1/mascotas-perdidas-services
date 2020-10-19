import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";
import { GetUbicationInput } from "@resolvers/ubication/GetUbicationInput";

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => GetUbicationInput, { nullable: true })
  ubicationData?: GetUbicationInput;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  dateOfBirth?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
