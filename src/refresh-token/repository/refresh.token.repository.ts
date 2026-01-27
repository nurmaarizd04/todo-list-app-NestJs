import { RefreshTokenEntity } from "src/core/entity/refresh.token.entity";

export abstract class RefreshTokenRepository {
        abstract createRefreshToken(entity: RefreshTokenEntity): Promise<RefreshTokenEntity>;

        abstract findActiveByUserId(userId: string): Promise<RefreshTokenEntity | null>;

        abstract findAllActiveByUserId(userId: string): Promise<RefreshTokenEntity[]>;

        abstract revoke(tokenId: string): Promise<void>;

        abstract revokeAllByUserId(userId: string): Promise<void>;

        abstract revokeAllExcept(userId: string, tokenId: string): Promise<void>;
}
