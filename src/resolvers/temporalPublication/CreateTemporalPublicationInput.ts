import { InputType, Field } from "type-graphql";
import { CreateUbicationInput } from "@resolvers/ubication/CreateUbicationInput";
import { TemporalPublication } from "@src/entity/TemporalPublication";
import { CreatePhotoInput } from "@src/resolvers/photo/CreatePhotoInput";

@InputType()
export class CreateTemporalPublicationInput
  implements Partial<TemporalPublication> {
  @Field()
  creatorId: string;

  @Field(() => CreatePhotoInput)
  photo: CreatePhotoInput;

  @Field(() => CreateUbicationInput)
  ubicationData: CreateUbicationInput;
}
