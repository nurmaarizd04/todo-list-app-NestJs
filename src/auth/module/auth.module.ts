import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { AuthService } from "../service/auth.service";
import { authProvider } from "../provider/auth.provider";
import { TokenModule } from "src/token/module/token.module";

@Module({
        imports: [DatabaseModule, TokenModule],
        exports: [AuthService, authProvider],
        providers: [authProvider, AuthService]
})
export class AuthModule {}
