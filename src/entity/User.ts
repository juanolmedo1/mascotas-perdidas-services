import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Publication } from "@entity/Publication";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("varchar")
  firstName: string;

  @Field()
  @Column("varchar")
  lastName: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  // @Field()
  // @Column("varchar")
  // dateOfBirth: string;

  // @Field()
  // @Column("varchar")
  // username: string;

  // @Field()
  // @Column("varchar")
  // password: string;

  @Field(() => [Publication])
  @OneToMany(
    () => Publication,
    (publication: Publication) => publication.creator
  )
  publications: Publication[];
}
