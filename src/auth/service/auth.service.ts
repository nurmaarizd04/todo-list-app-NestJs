import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthRepository } from "../repository/auth.repository";
import { LoginRequest } from "src/core/model/request/login.upsert.request";
import { DefaultResult } from "src/core/alias/core.alias";
import { UserEntity } from "src/core/entity/user.entity";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { composeDefaultResponseResult } from "src/core/utils/response.util";
import { AuthConverter } from "../converter/auth.converter";
import { compare, hash } from "bcrypt";
import { Constant } from "src/core/utils/constant.util";
import { LoginResult } from "../alias/auth.alias";
import { checkStringIsAvailable } from "src/core/utils/helper.util";
import { TokenRepository } from "src/token/repository/token.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { Credential } from "src/core/model/credential.model";
import { RegistrasiRequest } from "src/core/model/request/registrasi.upsert.request";
import { UserCredential } from "src/core/model/user.credential.model";
import { RefreshTokenEntity } from "src/core/entity/refresh.token.entity";
import { RefreshTokenRepository } from "src/refresh-token/repository/refresh.token.repository";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenRequest } from "src/core/model/request/refresh.token.request";
import { ConfigService } from "@nestjs/config";
import { RefreshTokenConverter } from "src/refresh-token/converter/refresh.token.converter";
import { getBearerToken } from "src/core/utils/auth.util";

@Injectable()
export class AuthService {
        constructor(
                private readonly authRepository: AuthRepository,
                private readonly tokenRepository: TokenRepository,
                private readonly refreshTokenRepository: RefreshTokenRepository,
                private readonly jwtService: JwtService,
                private readonly configService: ConfigService
        ) {}

        async createRegisterUser(data: RegistrasiRequest): Promise<DefaultResult> {
                if (
                        !checkStringIsAvailable(data.username) ||
                        !checkStringIsAvailable(data.email) ||
                        !checkStringIsAvailable(data.password)
                ) {
                        return composeDefaultResponseResult(StatusCodeUtil.BAD_REQUEST);
                }

                const existingUser: UserEntity | null = await this.authRepository.getUserByEmail(data.email);
                if (existingUser) {
                        return composeDefaultResponseResult(StatusCodeUtil.CONFLICT);
                }

                const userEntity: UserEntity = AuthConverter.convertUpsertRequestToEntity(data);
                userEntity.password = await hash(userEntity.password, Constant.DEFAULT_SALT);

                await this.authRepository.createRegisterUser(userEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async login(data: LoginRequest): Promise<LoginResult> {
                const existingUser: UserEntity | null = await this.authRepository.getUserByEmail(data.email);

                if (existingUser === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                if (!checkStringIsAvailable(existingUser.password)) {
                        return composeDefaultResponseResult(StatusCodeUtil.BAD_REQUEST);
                }

                const passwordCorrect = await compare(data.password, existingUser.password);

                if (!passwordCorrect) {
                        return composeDefaultResponseResult(StatusCodeUtil.UNAUTHORIZED);
                }

                await this.refreshTokenRepository.revokeAllByUserId(existingUser.id);
                const credential: Credential | null = await this.createCredentialAccess(existingUser);

                if (!credential) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK, credential);
        }

        async refreshAccessToken(request: RefreshTokenRequest): Promise<LoginResult> {
                try {
                        const payload = await this.verifyRefreshToken(request.refreshToken);
                        const storedToken = await this.validateStoredRefreshToken(payload.id, request.refreshToken);
                        const user = await this.getUserOrFail(payload.id);

                        await this.refreshTokenRepository.revoke(storedToken.id);

                        return this.buildCredentialResponse(user);
                } catch {
                        return composeDefaultResponseResult(StatusCodeUtil.UNAUTHORIZED);
                }
        }

        async logout(token: string): Promise<DefaultResult> {
                const payload = await this.verifyRefreshToken(token);

                const storedToken = await this.refreshTokenRepository.findActiveByUserId(payload.id);
                if (!storedToken) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                await this.refreshTokenRepository.revoke(storedToken.id);

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        public async logoutFromHeader(authHeader?: string): Promise<DefaultResult> {
                if (!checkStringIsAvailable(authHeader)) {
                        return composeDefaultResponseResult(StatusCodeUtil.BAD_REQUEST);
                }

                const token = getBearerToken(authHeader);
                return this.logout(token);
        }
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //// Internal Methods //////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //untuk memverifikasi JWT refresh token.
        private async verifyRefreshToken(refreshToken: string): Promise<{ id: string }> {
                return this.jwtService.verifyAsync<{ id: string }>(refreshToken, {
                        secret: this.configService.getOrThrow("APP_TODO_LIST_JWT_SECRET_REFRESH")
                });
        }

        // ntuk memastikan refresh token yang dikirim client valid di sisi server.
        private async validateStoredRefreshToken(userId: string, refreshToken: string): Promise<RefreshTokenEntity> {
                const token = await this.refreshTokenRepository.findActiveByUserId(userId);
                if (!token) {
                        throw new UnauthorizedException("Refresh token expired or revoked");
                }

                const isValid = await compare(refreshToken, token.fcmToken);
                if (!isValid) {
                        throw new UnauthorizedException("Invalid refresh token");
                }

                return token;
        }

        private async getUserOrFail(userId: string): Promise<UserEntity> {
                const user = await this.authRepository.getUserById(userId);
                if (!user) {
                        throw new UnauthorizedException();
                }
                return user;
        }

        // ini untuk buat token baru, simpan refresh token di DB, dan kembalikan credential lengkap.
        private async generateAndStoreCredential(user: UserEntity): Promise<Credential> {
                const payload = this.buildJwtPayload(user);

                const accessToken = await this.tokenRepository.createAccessToken(payload);
                const refreshToken = await this.tokenRepository.createRefreshToken(payload);

                const refreshTokenHash = await hash(refreshToken, Constant.DEFAULT_SALT);

                const refreshEntity: RefreshTokenEntity = RefreshTokenConverter.convertUpsertRequestToEntity(
                        user.id,
                        refreshTokenHash
                );

                await this.refreshTokenRepository.createRefreshToken(refreshEntity);

                return new Credential(accessToken, new UserCredential(user), refreshToken);
        }

        private async createCredentialAccess(user: UserEntity): Promise<Credential> {
                return this.generateAndStoreCredential(user);
        }

        private buildJwtPayload(user: UserEntity): TokenPayloadAuth {
                return {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role?.name ?? null
                };
        }

        // untuk menghasilkan credential baru untuk user dan mengemasnya jadi response API.
        private async buildCredentialResponse(user: UserEntity): Promise<LoginResult> {
                const credential: Credential = await this.generateAndStoreCredential(user);

                return composeDefaultResponseResult(StatusCodeUtil.OK, credential);
        }
}
