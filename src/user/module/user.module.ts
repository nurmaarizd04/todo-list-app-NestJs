import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { UserService } from "../service/user.service";
import { userProvider } from "../provider/user.provider";

@Module({
        imports: [DatabaseModule],
        exports: [UserService, userProvider],
        providers: [userProvider, UserService]
})
export class UserModule {}
