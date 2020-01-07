import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "@entity/User";
import { Photo } from "@entity/Photo";

export enum PublicationType {
  LOST = "LOST",
  FOUND = "FOUND",
  ADOPTION = "ADOPTION"
}

export enum PetType {
  DOG = "DOG",
  CAT = "CAT",
  OTHER = "OTHER"
}

export enum PetGenderType {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNDEFINED = "UNDEFINED"
}

@ObjectType()
@Entity()
export class Publication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @Column()
  province: string;

  @Field()
  @Column()
  location: string;

  @Field()
  @Column({ type: "int", default: 0 })
  complaints: number;

  @Field()
  @Column({ type: "enum", enum: PublicationType })
  type: PublicationType;

  @Field()
  @Column({ type: "enum", enum: PetType })
  pet: PetType;

  @Field()
  @Column({ type: "enum", enum: PetGenderType })
  petGender: PetGenderType;

  @Column("uuid")
  creatorId: string;

  @Field(() => User)
  @ManyToOne(
    () => User,
    (user: User) => user.publications,
    { onDelete: "CASCADE" }
  )
  @JoinColumn({ name: "creatorId" })
  creator: User;

  @Field(() => [Photo])
  @OneToMany(
    () => Photo,
    (photo: Photo) => photo.publication
  )
  photos: Photo[];
}
