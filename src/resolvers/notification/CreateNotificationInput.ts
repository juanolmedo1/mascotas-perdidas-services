import { InputType, Field } from "type-graphql";
import { Notification, NotificationType } from "@src/entity/Notification";

@InputType()
export class CreateNotificationInput implements Partial<Notification> {
  @Field(() => String)
  type: NotificationType;

  @Field()
  publicationId: string;

  @Field()
  userId: string;

  @Field()
  userCreatorId: string;

  @Field()
  photo: string;
}
