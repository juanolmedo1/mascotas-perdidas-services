import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Pet } from "@entity/Pet";

@ObjectType()
@Entity()
export class PetPhoto extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  type: string;

  @Field(() => String)
  @Column("text")
  data: string;

  @Column("uuid")
  petId: string;

  @ManyToOne(
    () => Pet,
    (pet: Pet) => pet.photos,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "petId" })
  pet: Pet;
}
