import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { TodoEntity } from "./todo.entity";
import { RoleEntity } from "./role.entity";
import { RefreshTokenEntity } from "./refresh.token.entity";

@Entity({ name: "user" })
export class UserEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "username",
                type: "varchar",
                length: 80,
                nullable: false
        })
        username: string;

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

        @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users)
        @JoinColumn({
                name: "role_id",
                referencedColumnName: "id",
                foreignKeyConstraintName: "fk_role_id"
        })
        role: RoleEntity;

        @OneToMany(() => TodoEntity, (todoEntity) => todoEntity.user)
        todos: TodoEntity[];

        @OneToMany(() => RefreshTokenEntity, (refreshTokenEntity: RefreshTokenEntity) => refreshTokenEntity.user)
        refreshTokens: RefreshTokenEntity[];
}
