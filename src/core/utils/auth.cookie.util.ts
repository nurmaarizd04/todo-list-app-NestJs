import { Response } from "express";
import { Constant } from "./constant.util";

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 1000 * 60 * 60 // 1 jam
};

export function setAccessTokenCookie(response: Response, accessToken?: string): void {
        if (!accessToken) return;

        response.cookie(Constant.ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
}
