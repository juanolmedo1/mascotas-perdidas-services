import { InputType, Field } from "type-graphql";
import { Favorite } from "@src/entity/Favorite";

@InputType()
export class DeleteUserFavoritePublication implements Partial<Favorite> {
  @Field()
  userId: string;

  @Field(() => String)
  publicationId: string;
}
