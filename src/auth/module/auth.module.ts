import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { AuthService } from "../service/auth.service";
import { authProvider } from "../provider/auth.provider";
import { TokenModule } from "src/token/module/token.module";
import { RefreshTokenModule } from "src/refresh-token/module/refresh.token.module";

@Module({
        imports: [DatabaseModule, TokenModule, RefreshTokenModule],
        exports: [AuthService, authProvider],
        providers: [authProvider, AuthService]
})
export class AuthModule {}
