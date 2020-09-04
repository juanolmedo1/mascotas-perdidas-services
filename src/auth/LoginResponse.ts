import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: String;

  @Field()
  refreshToken: String;
}
