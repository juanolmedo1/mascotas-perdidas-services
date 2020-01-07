import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Publication } from "@entity/Publication";

@ObjectType()
@Entity()
export class Photo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text")
  data: string;

  @Column("uuid")
  publicationId: string;

  @ManyToOne(
    () => Publication,
    (publication: Publication) => publication.photos,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "publicationId" })
  publication: Publication;
}
