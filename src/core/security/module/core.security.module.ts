import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "../jwt.strategy";

@Module({
        imports: [
                PassportModule,
                JwtModule.registerAsync({
                        imports: [ConfigModule],
                        inject: [ConfigService],
                        useFactory: (configService: ConfigService) => ({
                                secret: configService.getOrThrow<string>("APP_TODO_LIST_JWT_SECRET")
                        }),
                        global: true
                })
        ],
        providers: [JwtStrategy]
})
export class CoreSecurityModule {}
