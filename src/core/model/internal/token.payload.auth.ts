import { Expose } from "class-transformer";
import { UserEntity } from "src/core/entity/user.entity";

export class TokenPayloadAuth {
        @Expose({ name: "id" }) id: string;
        @Expose({ name: "email" }) email: string;

        constructor(user: UserEntity) {
                this.id = user.id!;
                this.email = user.email!;
        }
}
