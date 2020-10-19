import { InputType, Field } from "type-graphql";
import { User } from "@src/entity/User";
import { CreateProfilePhotoInput } from "./CreateProfilePhotoInput";
import { CreateUbicationInput } from "@resolvers/ubication/CreateUbicationInput";

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => CreateUbicationInput)
  ubicationData: CreateUbicationInput;

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
  photo: CreateProfilePhotoInput;
}
