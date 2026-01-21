import { Expose } from "class-transformer";
import { UserEntity } from "src/core/entity/user.entity";

export class TokenPayloadAuth {
        @Expose({ name: "id" }) id: string;
        @Expose({ name: "email" }) email: string;
        @Expose({ name: "issued_at" }) issuedAt: number;
        @Expose({ name: "expired_at" }) expiredAt: number;

        constructor(user: UserEntity) {
                this.id = user.id!;
                this.email = user.email!;
                this.issuedAt = Date.now();
                this.expiredAt = Date.now() + 1000 * 60 * 60; // 1 jam
        }
}
