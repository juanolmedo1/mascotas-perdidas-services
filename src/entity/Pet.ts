import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { PetPhoto } from "@src/entity/PetPhoto";
import { Publication } from "./Publication";

export enum PetType {
  DOG = "DOG",
  CAT = "CAT",
  OTHER = "OTHER"
}

export enum PetGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNDEFINED = "UNDEFINED"
}

export enum PetSize {
  VERY_SMALL = "VERY_SMALL",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE"
}

export enum PetColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
  DARK_BROWN = "DARK_BROWN",
  LIGHT_BROWN = "LIGHT_BROWN",
  GREY = "GREY",
  ORANGE = "ORANGE",
  OTHER = "OTHER"
}

export enum PetCollarColor {
  NONE = "NONE",
  WHITE = "WHITE",
  BLACK = "BLACK",
  GREY = "GREY",
  BLUE = "BLUE",
  RED = "RED",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  PINK = "PINK",
  ORANGE = "ORANGE",
  DARK_BROWN = "DARK_BROWN",
  LIGHT_BROWN = "LIGHT_BROWN",
  VIOLET = "VIOLET",
  OTHER = "OTHER"
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

  @Field()
  @Column({ type: "enum", enum: PetColor })
  color: PetColor;

  @Field()
  @Column({ type: "enum", enum: PetCollarColor })
  collar: PetCollarColor;

  @OneToOne(
    () => Publication,
    (publication: Publication) => publication.pet,
    { onDelete: "CASCADE" }
  )
  publication: Publication;

  @Field(() => [PetPhoto])
  @OneToMany(
    () => PetPhoto,
    (photo: PetPhoto) => photo.pet
  )
  photos: PetPhoto[];
}
