import {
  Entity,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "@entity/User";
import { Publication } from "@entity/Publication";

@ObjectType()
@Entity()
export class Favorite extends BaseEntity {
  @PrimaryColumn()
  @Field()
  userId: string;

  @PrimaryColumn()
  @Field()
  publicationId: string;

  @ManyToOne(() => User, (user) => user.publicationConnection, {
    primary: true,
  })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field(() => Publication)
  @ManyToOne(() => Publication, (publication) => publication.userConnection, {
    primary: true,
  })
  @JoinColumn({ name: "publicationId" })
  publication: Publication;
}
