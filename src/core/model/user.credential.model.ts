import { Expose } from "class-transformer";
import { UserEntity } from "src/core/entity/user.entity";

export class UserCredential {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "email" })
        email: string;

        constructor(entity: UserEntity) {
                this.id = entity.id;
                this.email = entity.email;
        }
}
