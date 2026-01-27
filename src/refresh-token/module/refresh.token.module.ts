import { Module } from "@nestjs/common";
import { refreshTokenProvider } from "../provider/refresh.token.provider";
import { DatabaseModule } from "src/core/database/module/database.module";

@Module({
        imports: [DatabaseModule],
        exports: [refreshTokenProvider],
        providers: [refreshTokenProvider]
})
export class RefreshTokenModule {}
