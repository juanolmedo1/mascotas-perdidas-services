import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Publication } from "@entity/Publication";

@ObjectType()
@Entity()
export class Ubication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "decimal", precision: 8, scale: 6 })
  firstLatitude: number;

  @Field()
  @Column({ type: "decimal", precision: 8, scale: 6 })
  firstLongitude: number;

  @Field(() => Number, { nullable: true })
  @Column({ type: "decimal", precision: 8, scale: 6, nullable: true })
  lastLatitude?: number;

  @Field(() => Number, { nullable: true })
  @Column({ type: "decimal", precision: 8, scale: 6, nullable: true })
  lastLongitude?: number;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  administrativeAreaLevel1: string;

  @Field()
  @Column()
  administrativeAreaLevel2: string;

  @Field()
  @Column()
  locality: string;

  @OneToOne(
    () => Publication,
    (publication: Publication) => publication.ubication
  )
  publication: Publication;
}
