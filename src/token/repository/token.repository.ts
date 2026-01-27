import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";

export abstract class TokenRepository {
        abstract createAccessToken(payload: TokenPayloadAuth): Promise<string>;

        abstract createRefreshToken(payload: TokenPayloadAuth): Promise<string>;
}
