import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Publication } from "@entity/Publication";

class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@ObjectType()
@Entity()
export class Ubication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Number)
  @Column({
    type: "decimal",
    precision: 8,
    scale: 6,
    transformer: new ColumnNumericTransformer(),
  })
  firstLatitude: number;

  @Field(() => Number)
  @Column({
    type: "decimal",
    precision: 8,
    scale: 6,
    transformer: new ColumnNumericTransformer(),
  })
  firstLongitude: number;

  @Field(() => Number, { nullable: true })
  @Column({
    type: "decimal",
    precision: 8,
    scale: 6,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  lastLatitude?: number;

  @Field(() => Number, { nullable: true })
  @Column({
    type: "decimal",
    precision: 8,
    scale: 6,
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
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
