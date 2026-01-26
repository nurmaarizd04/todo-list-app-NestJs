import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TodoEntity } from "./todo.entity";

@Entity({ name: "todo_item" })
export class TodoItemEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "title",
                type: "varchar",
                length: 40
        })
        title: string;

        @Column({
                name: "is_completed",
                type: "boolean",
                default: false
        })
        isCompleted: boolean;

        @Column({
                name: "todo_id",
                type: "uuid",
                nullable: false
        })
        todoId: string;

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

        @ManyToOne(() => TodoEntity, (todo) => todo.todoItems, { onDelete: "CASCADE" })
        @JoinColumn({
                name: "todo_id",
                referencedColumnName: "id"
        })
        todo: TodoEntity;
}
