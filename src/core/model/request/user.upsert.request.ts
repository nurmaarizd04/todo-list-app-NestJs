import { Expose } from "class-transformer";

export class UserUpsertRequest {
        @Expose({ name: "username" })
        username: string;

        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "role_id" })
        roleId: string;
}
