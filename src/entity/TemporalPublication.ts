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
import addMinutes from "date-fns/addMinutes";

class DateTransformer {
  to(data: Date): Date {
    return data;
  }
  from(data: string): Date {
    const date = new Date(data);
    const timezoneOffset = date.getTimezoneOffset();
    return addMinutes(date, -timezoneOffset * 2);
  }
}

@ObjectType()
@Entity()
export class TemporalPublication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @CreateDateColumn({ type: "timestamp", transformer: new DateTransformer() })
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
