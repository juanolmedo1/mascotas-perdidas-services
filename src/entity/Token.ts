import {
  Entity,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "@entity/User";

@ObjectType()
@Entity()
export class Token extends BaseEntity {
  @Field()
  @Column()
  userId: string;

  @Field()
  @PrimaryColumn()
  token: string;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: "userId" })
  user: User;
}
