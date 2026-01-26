import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, JwtFromRequestFunction } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { TokenPayloadAuth } from "../model/internal/token.payload.auth";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
        constructor(configService: ConfigService) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
                const jwtExtractor: JwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken();

                const secret = configService.getOrThrow<string>("APP_TODO_LIST_JWT_SECRET");

                super({
                        jwtFromRequest: jwtExtractor,
                        secretOrKey: secret,
                        ignoreExpiration: false
                });
        }

        validate(payload: TokenPayloadAuth): TokenPayloadAuth {
                if (!payload?.id) {
                        throw new UnauthorizedException("Invalid JWT payload");
                }
                return payload;
        }
}
