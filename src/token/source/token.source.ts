import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenRepository } from "../repository/token.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenSource extends TokenRepository {
        constructor(
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService
        ) {
                super();
        }

        async createAccessToken(payload: TokenPayloadAuth): Promise<string> {
                return this.jwtService.signAsync(
                        {
                                id: payload.id,
                                email: payload.email
                        },
                        {
                                secret: this.configService.getOrThrow("APP_TODO_LIST_JWT_SECRET"),
                                expiresIn: "2m"
                        }
                );
        }

        async createRefreshToken(payload: TokenPayloadAuth): Promise<string> {
                return this.jwtService.signAsync(
                        {
                                id: payload.id
                        },
                        {
                                secret: this.configService.getOrThrow("APP_TODO_LIST_JWT_SECRET_REFRESH"),
                                expiresIn: "1d"
                        }
                );
        }
}
