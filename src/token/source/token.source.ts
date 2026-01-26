import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenRepository } from "../repository/token.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";

@Injectable()
export class TokenSource extends TokenRepository {
        constructor(private readonly jwtService: JwtService) {
                super();
        }

        async createAccessToken(payload: TokenPayloadAuth): Promise<string> {
                return this.jwtService.signAsync(
                        {
                                id: payload.id,
                                email: payload.email
                        },
                        {
                                expiresIn: "2m"
                        }
                );
        }
}
