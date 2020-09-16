import { Field, ObjectType } from "type-graphql";
import { Publication } from "@src/entity/Publication";

@ObjectType()
export class GetMatchingsResponse {
  @Field(() => [Publication])
  publicationsViewed: Publication[];

  @Field(() => [Publication])
  publicationsNotViewed: Publication[];
}
