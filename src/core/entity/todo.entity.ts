import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { UserEntity } from "./user.entity";
import { TodoItemEntity } from "./todo.item.entity";

@Entity({ name: "todo" })
export class TodoEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "title",
                type: "varchar",
                length: 40
        })
        title: string;

        @Column({
                name: "user_id",
                type: "uuid",
                nullable: false
        })
        userId: string;

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

        // ✅ banyak checklist milik 1 user
        @ManyToOne(() => UserEntity, (user) => user.todos, { onDelete: "CASCADE" })
        @JoinColumn({ name: "user_id" })
        user: UserEntity;

        @OneToMany(() => TodoItemEntity, (todoItemEntity) => todoItemEntity.todo)
        todoItems: TodoItemEntity[];
}
