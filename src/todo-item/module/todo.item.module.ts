import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { TodoItemService } from "../service/todo.item.service";
import { todoItemProvider } from "../provider/todo.item.provider";

@Module({
        imports: [DatabaseModule],
        exports: [TodoItemService, todoItemProvider],
        providers: [todoItemProvider, TodoItemService]
})
export class TodoItemModule {}
