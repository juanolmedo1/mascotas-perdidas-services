import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { PetPhoto } from "@src/entity/PetPhoto";
import { Publication } from "./Publication";

export enum PetType {
  DOG = "DOG",
  CAT = "CAT",
  OTHER = "OTHER",
}

export enum PetGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNDEFINED = "UNDEFINED",
}

export enum PetSize {
  VERY_SMALL = "VERY_SMALL",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

@ObjectType()
@Entity()
export class Pet extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "enum", enum: PetType })
  type: PetType;

  @Field()
  @Column({ type: "enum", enum: PetGender })
  gender: PetGender;

  @Field()
  @Column({ type: "enum", enum: PetSize })
  size: PetSize;

  @Field(() => [String])
  @Column("simple-array")
  color: string[];

  @Field()
  @Column()
  collar: boolean;

  @OneToOne(() => Publication, (publication: Publication) => publication.pet)
  publication: Publication;

  @Field(() => [PetPhoto])
  @OneToMany(() => PetPhoto, (photo: PetPhoto) => photo.pet)
  photos: PetPhoto[];
}
