import { Injectable } from "@nestjs/common";
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

@Injectable()
export class AuthService {
        constructor(
                private readonly authRepository: AuthRepository,
                private readonly tokenRepository: TokenRepository
        ) {}

        async createRegisterUser(data: RegistrasiRequest): Promise<DefaultResult> {
                const userEntity: UserEntity = AuthConverter.convertUpsertRequestToEntity(data);
                userEntity.password = await hash(userEntity.password, Constant.DEFAULT_SALT);

                await this.authRepository.createRegisterUser(userEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async login(data: LoginRequest): Promise<LoginResult> {
                const existingUser = await this.authRepository.getUserByEmail(data.email);

                if (!existingUser) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                if (!checkStringIsAvailable(existingUser.password)) {
                        return composeDefaultResponseResult(StatusCodeUtil.BAD_REQUEST);
                }

                const passwordCorrect = await compare(data.password, existingUser.password);

                if (!passwordCorrect) {
                        return composeDefaultResponseResult(StatusCodeUtil.UNAUTHORIZED);
                }

                const credential: Credential | null = await this.createCredentialAccess(existingUser);

                if (!credential) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK, credential);
        }

        private async createCredentialAccess(user: UserEntity): Promise<Credential | null> {
                const tokenPayload = new TokenPayloadAuth(user);

                const accessToken = await this.tokenRepository.createAccessToken(tokenPayload);

                if (!checkStringIsAvailable(accessToken)) {
                        return null;
                }

                return new Credential(accessToken!, new UserCredential(user));
        }
}
