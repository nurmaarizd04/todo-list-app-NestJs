import { Request } from "express";
import { TokenPayloadAuth } from "../model/internal/token.payload.auth";

export interface AuthenticatedRequest extends Request {
        user: TokenPayloadAuth;
}
