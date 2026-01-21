import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
        imports: [
                JwtModule.registerAsync({
                        imports: [ConfigModule],
                        useFactory: (configService: ConfigService) => ({
                                secret: configService.get("APP_TODO_LIST_JWT_SECRET")
                        }),
                        global: true,
                        inject: [ConfigService]
                })
        ]
})
export class CoreSecurityModule {}
