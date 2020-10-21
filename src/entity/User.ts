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
import { Favorite } from "@entity/Favorite";

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

  @Field()
  @CreateDateColumn({ type: "timestamp" })
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

  @OneToMany(() => Favorite, (fav) => fav.user)
  publicationConnection: Favorite[];
}
