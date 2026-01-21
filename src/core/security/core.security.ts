import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { AuthenticatedRequest } from "../utils/request.util";
import { TokenPayloadAuth } from "../model/internal/token.payload.auth";

@Injectable()
export class CoreSecurity implements CanActivate {
        constructor(
                private readonly configService: ConfigService,
                private readonly jwtService: JwtService
        ) {}

        async canActivate(context: ExecutionContext): Promise<boolean> {
                const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

                const token = this.extractTokenFromHeader(request);
                if (!token) throw new UnauthorizedException();

                try {
                        const payload = await this.jwtService.verifyAsync<TokenPayloadAuth>(token, {
                                secret: this.configService.get("APP_TODO_LIST_JWT_SECRET")
                        });

                        request.user = payload;
                        return true;
                } catch {
                        throw new UnauthorizedException();
                }
        }

        private extractTokenFromHeader(request: Request): string | null {
                const auth = request.headers.authorization;
                if (!auth) return null;

                const [type, token] = auth.split(" ");
                return type === "Bearer" ? token : null;
        }
}
