import { Expose, Type } from "class-transformer";
import { UserCredential } from "./user.credential.model";

export class Credential {
        @Expose({ name: "access_token" }) accessToken: string;

        @Expose({ name: "user" })
        @Type(() => UserCredential)
        user: UserCredential;

        constructor(accessToken: string, user: UserCredential) {
                this.user = user;
                this.accessToken = accessToken;
        }
}
