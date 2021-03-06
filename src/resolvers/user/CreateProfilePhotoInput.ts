import { InputType, Field } from "type-graphql";
import { ProfilePhoto } from "@src/entity/ProfilePhoto";

@InputType()
export class CreateProfilePhotoInput implements Partial<ProfilePhoto> {
  @Field()
  data: string;

  @Field()
  type: string;

  @Field(() => String, { nullable: true })
  publicId?: string;
}
