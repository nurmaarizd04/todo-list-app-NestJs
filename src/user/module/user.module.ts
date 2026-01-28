import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { UserService } from "../service/user.service";
import { userProvider } from "../provider/user.provider";
import { AuthModule } from "src/auth/module/auth.module";
import { RoleModule } from "src/role/module/role.module";

@Module({
        imports: [DatabaseModule, AuthModule, RoleModule],
        exports: [UserService, userProvider],
        providers: [userProvider, UserService]
})
export class UserModule {}
