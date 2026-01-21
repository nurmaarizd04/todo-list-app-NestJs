import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { instanceToPlain } from "class-transformer";
import { TokenRepository } from "../repository/token.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";

@Injectable()
export class TokenSource extends TokenRepository {
        constructor(private readonly jwtService: JwtService) {
                super();
        }

        async createAccessToken(payload: TokenPayloadAuth): Promise<string | null> {
                return this.jwtService.signAsync(instanceToPlain(payload));
        }
}
