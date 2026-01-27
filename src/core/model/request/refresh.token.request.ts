import { Expose } from "class-transformer";

export class RefreshTokenRequest {
        @Expose({ name: "refresh_token" })
        refreshToken: string;
}
