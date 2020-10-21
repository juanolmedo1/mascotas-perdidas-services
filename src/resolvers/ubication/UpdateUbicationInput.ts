import { Ubication } from "@src/entity/Ubication";
import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateUbicationInput implements Partial<Ubication> {
  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  administrativeAreaLevel1?: string;

  @Field(() => String, { nullable: true })
  administrativeAreaLevel2?: string;

  @Field(() => String, { nullable: true })
  locality?: string;

  @Field(() => Number, { nullable: true })
  firstLatitude?: number;

  @Field(() => Number, { nullable: true })
  firstLongitude?: number;

  @Field(() => Number, { nullable: true })
  lastLatitude?: number;

  @Field(() => Number, { nullable: true })
  lastLongitude?: number;
}
