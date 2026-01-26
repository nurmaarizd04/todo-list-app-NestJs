import { Expose, Type } from "class-transformer";
import { Todo } from "./todo.model";

export class TodotItem {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "is_completed" })
        isCompleted: boolean;

        @Expose({ name: "todo_id" })
        todoId: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;

        @Expose({ name: "todo" })
        @Type(() => Todo)
        todo: Todo;
}
