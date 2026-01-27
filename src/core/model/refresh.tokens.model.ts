import { Expose, Type } from "class-transformer";
import { User } from "./user.model";

export class RefreshTokens {
        @Expose({ name: "id" })
        id: string;

        fcmToken: string;

        @Expose({ name: "expires_at" })
        expiresAt: number;

        @Expose({ name: "is_revoked" })
        isRevoked: boolean;

        @Expose({ name: "revoked_at" })
        revokedAt?: number;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: number;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: number;

        @Expose({ name: "user" })
        @Type(() => User)
        user: User;
}
