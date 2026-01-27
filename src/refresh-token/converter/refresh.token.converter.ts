import { RefreshTokenEntity } from "src/core/entity/refresh.token.entity";
import { Constant } from "src/core/utils/constant.util";

export class RefreshTokenConverter {
        static convertUpsertRequestToEntity(userId: string, refreshTokenHash: string): RefreshTokenEntity {
                const refreshEntity: RefreshTokenEntity = new RefreshTokenEntity();
                refreshEntity.userId = userId!;
                refreshEntity.fcmToken = refreshTokenHash;
                refreshEntity.isRevoked = false;
                refreshEntity.expiresAt = Date.now() + Constant.REFRESH_TOKEN_EXPIRES_MS;
                refreshEntity.createdAt = Date.now();

                return refreshEntity;
        }
}
