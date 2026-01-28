import { Expose } from "class-transformer";

export class TokenPayloadAuth {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "username" })
        username: string;

        @Expose({ name: "email" })
        email: string;

        @Expose({ name: "role" })
        role?: string | null;

        @Expose({ name: "iat" })
        iat?: number;

        @Expose({ name: "exp" })
        exp?: number;
}
