import { Expose, Type } from "class-transformer";
import { User } from "./user.model";
import { TodotItem } from "./todo.item.model";

export class Todo {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "user_id" })
        userId: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;

        @Expose({ name: "user" })
        @Type(() => User)
        user: User;

        @Expose({ name: "todo_items" })
        @Type(() => TodotItem)
        todoItems: TodotItem[];
}
