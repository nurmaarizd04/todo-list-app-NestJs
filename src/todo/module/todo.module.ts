import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { UserModule } from "src/user/module/user.module";
import { TodoService } from "../service/todo.service";
import { todoProvider } from "../provider/todo.provider";

@Module({
        imports: [DatabaseModule, UserModule],
        exports: [TodoService, todoProvider],
        providers: [todoProvider, TodoService]
})
export class TodoModule {}
