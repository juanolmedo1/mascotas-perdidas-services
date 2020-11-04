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

export enum NotificationType {
  POSSIBLE_MATCHING = "POSSIBLE_MATCHING",
  DOBLE_CONFIRMATION = "DOBLE_CONFIRMATION",
  NEW_PUBLICATION = "NEW_PUBLICATION",
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

  @Field()
  @Column()
  photo: string;

  @Field(() => String)
  @Column("uuid")
  publicationId: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Column("uuid")
  userCreatorId: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    (userCreator: User) => userCreator.notificationsCreated
  )
  @JoinColumn({ name: "userCreatorId" })
  userCreator: User;

  @Column("uuid")
  userId: string;

  @ManyToOne(() => User, (user: User) => user.notifications)
  @JoinColumn({ name: "userId" })
  user: User;
}
