import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { User } from "@entity/User";
import { PetType } from "@entity/Pet";
import { Ubication } from "@entity/Ubication";

@ObjectType()
@Entity()
export class TemporalPublication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @Field(() => String)
  @Column()
  petPhoto: string;

  @Field(() => String)
  @Column()
  petPhotoPublicId: string;

  @Field(() => String)
  @Column()
  petBreed: string;

  @Field()
  @Column({ type: "enum", enum: PetType })
  petType: PetType;

  @Column("uuid")
  ubicationId: string;

  @Field(() => Ubication)
  @OneToOne(() => Ubication, (ubication: Ubication) => ubication.id)
  @JoinColumn({ name: "ubicationId" })
  ubication: Ubication;

  @Column("uuid")
  creatorId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.temporalPublications)
  @JoinColumn({ name: "creatorId" })
  creator: User;
}
