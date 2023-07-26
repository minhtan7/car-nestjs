import { Exclude } from "class-transformer";
import { Report } from "src/reports/report.entity";
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove, OneToMany } from "typeorm"


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Report, report => report.user)
  reports: Report[]

  @AfterInsert()
  logInsert() {
    console.log("Inserted user with id: ", this.id)
  }
  @AfterUpdate()
  logUpdate() {
    console.log("Updated user with id: ", this.id)
  }

  @AfterRemove()
  logRemoved() {
    console.log("Removedd user with id: ", this.id)
  }

}