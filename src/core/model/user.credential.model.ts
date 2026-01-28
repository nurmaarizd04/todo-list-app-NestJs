import { Expose } from "class-transformer";
import { UserEntity } from "src/core/entity/user.entity";

export class UserCredential {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "username" })
        username: string;

        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "role" })
        role?: string | null;

        constructor(entity: UserEntity) {
                this.id = entity.id;
                this.username = entity.username;
                this.email = entity.email;
                this.role = entity.role?.name ?? null;
        }
}
