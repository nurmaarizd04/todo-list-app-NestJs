import { Expose } from "class-transformer";

export class TodoItemUpsertRequest {
        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "is_completed" })
        isCompleted: boolean;

        @Expose({ name: "todo_id" })
        todoId: string;
}
