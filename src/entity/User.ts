import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Publication } from "@entity/Publication";
import { ProfilePhoto } from "@entity/ProfilePhoto";
import { Token } from "@entity/Token";
import { Favorite } from "@entity/Favorite";
import { Notification } from "@entity/Notification";
import { TemporalPublication } from "@entity/TemporalPublication";
import addMinutes from "date-fns/addMinutes";

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
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  phoneNumber: string;

  @Field()
  @Column()
  dateOfBirth: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  password: string;

  @Field(() => [String], { nullable: true })
  @Column("simple-array", { nullable: true })
  notificationTokens?: string[];

  @Field()
  @CreateDateColumn({ type: "timestamp", transformer: new DateTransformer() })
  createdAt: Date;

  @Column("uuid")
  profilePictureId: string;

  @Field(() => ProfilePhoto)
  @OneToOne(() => ProfilePhoto, (photo: ProfilePhoto) => photo.id)
  @JoinColumn({ name: "profilePictureId" })
  profilePicture: ProfilePhoto;

  @Field(() => [Publication])
  @OneToMany(
    () => Publication,
    (publication: Publication) => publication.creator
  )
  publications: Publication[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @Field(() => [TemporalPublication])
  @OneToMany(
    () => TemporalPublication,
    (publication: TemporalPublication) => publication.creator
  )
  temporalPublications: TemporalPublication[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  publicationConnection: Favorite[];

  @Field(() => [Notification])
  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.user
  )
  notifications: Notification[];

  @OneToMany(
    () => Notification,
    (notification: Notification) => notification.userCreator
  )
  notificationsCreated: Notification[];
}
