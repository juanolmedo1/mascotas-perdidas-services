import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { PetGender, PetSize } from "@entity/Pet";

@ObjectType()
@Entity()
export class CommonValues extends BaseEntity {
  @PrimaryColumn()
  @Field()
  breed: string;

  @Field()
  @Column({ type: "enum", enum: PetGender })
  gender: PetGender;

  @Field()
  @Column({ type: "enum", enum: PetSize })
  size: PetSize;

  @Field()
  @Column()
  color: string;
}
