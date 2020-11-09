import { InputType, Field } from "type-graphql";
import { Notification, NotificationType } from "@src/entity/Notification";

@InputType()
export class CreateNotificationInput implements Partial<Notification> {
  @Field(() => String)
  type: NotificationType;

  @Field(() => String, { nullable: true })
  publicationId?: string;

  @Field()
  userId: string;

  @Field(() => String, { nullable: true })
  userCreatorId?: string;

  @Field(() => [String])
  photos: string[];
}
