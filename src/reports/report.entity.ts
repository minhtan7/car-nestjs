import { IsBoolean } from "class-validator";
import { User } from "src/users/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.reports)
  user: User

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  mileage: number;

  @Column({ default: false })
  approved: boolean
}