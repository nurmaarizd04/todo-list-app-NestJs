import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UserEntity } from "src/core/entity/user.entity";

@Entity({ name: "refresh_tokens" })
export class RefreshTokenEntity {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({
                name: "user_id",
                type: "uuid"
        })
        userId: string;

        @Column({
                name: "fcm_token",
                type: "varchar",
                length: 255
        })
        fcmToken: string;

        @Column({
                name: "expires_at",
                type: "bigint"
        })
        expiresAt: number;

        @Column({
                name: "is_revoked",
                type: "boolean",
                default: false
        })
        isRevoked: boolean;

        @Column({
                name: "revoked_at",
                type: "bigint",
                nullable: true
        })
        revokedAt?: number;

        @Column({
                name: "created_at",
                type: "bigint"
        })
        createdAt: number;

        @Column({
                name: "updated_at",
                type: "bigint",
                nullable: true
        })
        updatedAt?: number;

        @ManyToOne(() => UserEntity, {
                onDelete: "CASCADE"
        })
        @JoinColumn({ name: "user_id" })
        user: UserEntity;
}
