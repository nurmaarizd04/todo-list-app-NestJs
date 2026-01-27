import { Injectable } from "@nestjs/common";
import { RefreshTokenRepository } from "../repository/refresh.token.repository";
import { RefreshTokenEntity } from "src/core/entity/refresh.token.entity";
import { IsNull, Repository, Not, MoreThan } from "typeorm";

@Injectable()
export class RefreshTokenSource extends RefreshTokenRepository {
        constructor(private readonly refreshTokenRepository: Repository<RefreshTokenEntity>) {
                super();
        }

        createRefreshToken(entity: RefreshTokenEntity): Promise<RefreshTokenEntity> {
                return this.refreshTokenRepository.save(entity);
        }

        findActiveByUserId(userId: string): Promise<RefreshTokenEntity | null> {
                return this.refreshTokenRepository.findOne({
                        where: {
                                userId,
                                revokedAt: IsNull(),
                                expiresAt: MoreThan(Date.now())
                        }
                });
        }

        findAllActiveByUserId(userId: string): Promise<RefreshTokenEntity[]> {
                return this.refreshTokenRepository.find({
                        where: {
                                userId,
                                revokedAt: IsNull(),
                                expiresAt: MoreThan(Date.now())
                        }
                });
        }

        async revoke(tokenId: string): Promise<void> {
                await this.refreshTokenRepository.update(tokenId, {
                        revokedAt: Date.now(),
                        isRevoked: true
                });
        }

        async revokeAllByUserId(userId: string): Promise<void> {
                await this.refreshTokenRepository.update(
                        { userId, revokedAt: IsNull() },
                        { revokedAt: Date.now(), isRevoked: true }
                );
        }

        async revokeAllExcept(userId: string, tokenId: string): Promise<void> {
                await this.refreshTokenRepository.update(
                        { userId, revokedAt: IsNull(), id: Not(tokenId) },
                        { revokedAt: Date.now(), isRevoked: true }
                );
        }
}
