import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "@entity/User";
import addMinutes from "date-fns/addMinutes";

export enum NotificationType {
  POSSIBLE_MATCHING = "POSSIBLE_MATCHING",
  DOBLE_CONFIRMATION = "DOBLE_CONFIRMATION",
  DELETED_FOR_COMPLAINTS = "DELETED_FOR_COMPLAINTS",
  TEMPORAL_PUBLICATION = "TEMPORAL_PUBLICATION",
}

class DateTransformer {
  to(data: Date): Date {
    return data;
  }
  from(data: string): Date {
    const date = new Date(data);
    const timezoneOffset = date.getTimezoneOffset();
    return addMinutes(date, -timezoneOffset * 2);
  }
}

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @Field(() => [String])
  @Column({ type: "simple-array" })
  photos: string[];

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  publicationId?: string[];

  @Field()
  @CreateDateColumn({ type: "timestamp", transformer: new DateTransformer() })
  createdAt: Date;

  @Column("uuid", { nullable: true })
  userCreatorId?: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(
    () => User,
    (userCreator: User) => userCreator.notificationsCreated
  )
  @JoinColumn({ name: "userCreatorId" })
  userCreator?: User;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => User, (user: User) => user.notifications)
  @JoinColumn({ name: "userId" })
  user: User;
}
