import { Expose } from "class-transformer";

export class LoginRequest {
        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "password" })
        password: string;
}
