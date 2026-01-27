import { JwtService } from "@nestjs/jwt";
import { TokenRepository } from "../repository/token.repository";
import { TokenSource } from "../source/token.source";
import { ConfigService } from "@nestjs/config";

export const tokenProvider = {
        provide: TokenRepository,
        useFactory: (jwtService: JwtService, configService: ConfigService) =>
                new TokenSource(jwtService, configService),
        inject: [JwtService, ConfigService]
};
