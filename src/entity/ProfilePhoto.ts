import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "@entity/User";

@ObjectType()
@Entity()
export class ProfilePhoto extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  type: string;

  @Field(() => String)
  @Column("text")
  data: string;

  @Field(() => String)
  @Column("text")
  publicId: string;

  @OneToOne(() => User, (user: User) => user.profilePicture)
  user: User;
}
