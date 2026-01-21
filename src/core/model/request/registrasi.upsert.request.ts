import { Expose } from "class-transformer";

export class RegistrasiRequest {
        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "password" })
        password: string;
}
