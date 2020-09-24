import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "@entity/User";
import { Pet } from "@entity/Pet";
import { Favorite } from "@entity/Favorite";

export enum PublicationType {
  LOST = "LOST",
  FOUND = "FOUND",
  ADOPTION = "ADOPTION",
}

@ObjectType()
@Entity()
export class Publication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "enum", enum: PublicationType })
  type: PublicationType;

  @Field()
  @Column()
  province: string;

  @Field()
  @Column()
  location: string;

  @Field()
  @Column()
  phoneNumber: string;

  @Field()
  @Column()
  reward?: boolean;

  @Field(() => String)
  @Column("text")
  additionalInfo: string;

  @Field()
  @Column({ type: "int", default: 0 })
  complaints: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  lastMatchingSearch: Date;

  @Column()
  petId: string;

  @Field(() => Pet)
  @OneToOne(() => Pet, (pet: Pet) => pet.id)
  @JoinColumn({ name: "petId" })
  pet: Pet;

  @Column("uuid")
  creatorId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.publications)
  @JoinColumn({ name: "creatorId" })
  creator: User;

  @OneToMany(() => Favorite, (fav) => fav.publication)
  userConnection: Favorite[];
}
