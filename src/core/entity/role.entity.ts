import { OneToMany } from "typeorm";
import { Column } from "typeorm";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({
        name: "role"
})
export class RoleEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "name",
                type: "varchar",
                length: 16,
                unique: true
        })
        name: string;

        @Column({
                name: "created_at",
                type: "bigint"
        })
        createdAt: bigint;

        @Column({
                name: "updated_at",
                type: "bigint",
                nullable: true
        })
        updatedAt?: bigint;

        @OneToMany(() => UserEntity, (user: UserEntity) => user.role)
        users: UserEntity[];
}
