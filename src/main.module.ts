import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CoreSecurityModule } from "./core/security/module/core.security.module";
import { AuthModule } from "./auth/module/auth.module";
import { AuthController } from "./auth/controller/auth.controller";
import { TokenModule } from "./token/module/token.module";
import { ChecklistModule } from "./checklist/module/checklist.module";
import { ChecklistController } from "./checklist/controller/checklist.controller";
import { UserController } from "./user/controller/user.controller";
import { UserModule } from "./user/module/user.module";
import { ChecklistItemModule } from "./checklist-item/module/checklist.item.module";
import { ChecklistItemController } from "./checklist-item/controller/checklist.item.controller";

@Module({
        imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                CoreSecurityModule,
                AuthModule,
                TokenModule,
                UserModule,
                ChecklistModule,
                ChecklistItemModule
        ],
        controllers: [AuthController, UserController, ChecklistController, ChecklistItemController]
})
export class MainModule {}
