import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ChecklistEntity } from "./checklist.entity";

@Entity({ name: "user" })
export class UserEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "email",
                type: "varchar",
                length: 80,
                unique: true,
                nullable: false
        })
        email: string;

        @Column({
                name: "password",
                type: "varchar",
                length: 255,
                nullable: false
        })
        password: string;

        @Column({
                name: "created_at",
                type: "bigint",
                nullable: false
        })
        createdAt: bigint;

        @Column({
                name: "updated_at",
                type: "bigint",
                nullable: true
        })
        updatedAt?: bigint;

        @OneToMany(() => ChecklistEntity, (checklist) => checklist.user)
        checklists: ChecklistEntity[];
}
