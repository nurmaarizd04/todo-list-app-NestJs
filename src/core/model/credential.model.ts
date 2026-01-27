import { Expose, Type } from "class-transformer";
import { UserCredential } from "./user.credential.model";

export class Credential {
        @Expose({ name: "access_token" })
        accessToken: string;

        @Expose({ name: "refresh_Token" })
        refreshToken?: string;

        @Expose({ name: "user" })
        @Type(() => UserCredential)
        user: UserCredential;

        constructor(accessToken: string, user: UserCredential, refreshToken?: string) {
                this.accessToken = accessToken;
                this.user = user;
                this.refreshToken = refreshToken;
        }
}
