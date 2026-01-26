import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CoreSecurityModule } from "./core/security/module/core.security.module";
import { AuthModule } from "./auth/module/auth.module";
import { AuthController } from "./auth/controller/auth.controller";
import { TokenModule } from "./token/module/token.module";
import { UserController } from "./user/controller/user.controller";
import { UserModule } from "./user/module/user.module";
import { TodoItemModule } from "./todo-item/module/todo.item.module";
import { TodoItemController } from "./todo-item/controller/todo.item.controller";
import { TodoModule } from "./todo/module/todo.module";
import { TodoController } from "./todo/controller/todo.controller";

@Module({
        imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                CoreSecurityModule,
                AuthModule,
                TokenModule,
                UserModule,
                TodoModule,
                TodoItemModule
        ],
        controllers: [AuthController, UserController, TodoController, TodoItemController]
})
export class MainModule {}
