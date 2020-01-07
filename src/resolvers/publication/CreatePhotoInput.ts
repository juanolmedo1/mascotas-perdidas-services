import { InputType, Field } from "type-graphql";
import { Photo } from "@src/entity/Photo";

@InputType()
export class CreatePhotoInput implements Partial<Photo> {
  @Field()
  publicationId: string;

  @Field()
  data: string;
}
