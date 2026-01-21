import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenPayloadAuth } from "../model/internal/token.payload.auth";
import { AuthenticatedRequest } from "../utils/request.util";

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): TokenPayloadAuth => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

        return request.user;
});
