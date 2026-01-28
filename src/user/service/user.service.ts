import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";
import { GetPageUsersResult, GetUserItemResult } from "../alias/user.alias";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { UserEntity } from "src/core/entity/user.entity";
import { User } from "src/core/model/user.model";
import { UserConverter } from "../converter/user.converter";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { DefaultResult } from "src/core/alias/core.alias";
import { UserUpsertRequest } from "src/core/model/request/user.upsert.request";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { AuthRepository } from "src/auth/repository/auth.repository";
import { RoleEntity } from "src/core/entity/role.entity";
import { RoleRepository } from "src/role/repository/role.repository";

@Injectable()
export class UserService {
        constructor(
                private readonly userRepository: UserRepository,
                private readonly authRepository: AuthRepository,
                private readonly roleRepository: RoleRepository
        ) {}

        async getPageUser(query: UserQueryParamRequest): Promise<GetPageUsersResult> {
                const userEntity: PagingData<UserEntity> = await this.userRepository.getPageUser(query);

                const checklist: User[] = UserConverter.convertEntitiesToModels(userEntity.data);
                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: userEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, checklist);
        }

        async getUserById(id: string): Promise<GetUserItemResult> {
                const UserEntity: UserEntity | null = await this.userRepository.getUserById(id);

                if (UserEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const user: User = UserConverter.convertEntityToModel(UserEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, user);
        }

        async updateUserById(userInfo: TokenPayloadAuth, id: string, data: UserUpsertRequest): Promise<DefaultResult> {
                if (userInfo.role !== "super-admin") {
                        return composeDefaultResponseResult(StatusCodeUtil.FORBIDDEN);
                }

                if (data.email) {
                        const existingUserEmail: UserEntity | null = await this.authRepository.getUserByEmail(
                                data.email
                        );
                        if (existingUserEmail) {
                                return composeDefaultResponseResult(StatusCodeUtil.CONFLICT);
                        }
                }

                const userEntity: UserEntity | null = await this.userRepository.getUserById(id);
                if (userEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const roleEntity: RoleEntity | null = await this.roleRepository.getRoleById(data.roleId);

                if (roleEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<UserEntity> = UserConverter.convertUpdateRequestToEntity(
                        data,
                        userEntity,
                        roleEntity
                );

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.userRepository.updateUserById(userEntity.id, updateInfo.data);

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteUserById(userInfo: TokenPayloadAuth, id: string): Promise<DefaultResult> {
                if (userInfo.role !== "super-admin") {
                        return composeDefaultResponseResult(StatusCodeUtil.FORBIDDEN);
                }

                const deletedSuccess: boolean = await this.userRepository.deleteUserById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
