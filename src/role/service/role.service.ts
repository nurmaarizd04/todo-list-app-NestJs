import { Injectable } from "@nestjs/common";
import { DefaultResult } from "src/core/alias/core.alias";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { RoleRepository } from "../repository/role.repository";
import { RoleUpsertRequest } from "src/core/model/request/role.upsert.request.model";
import { RoleEntity } from "src/core/entity/role.entity";
import { RoleConverter } from "../converter/role.converter";
import { RoleQueryParamRequest } from "src/core/model/request/role.query.param.request";
import { GetPageRolesResult, GetRoleItemResult } from "../alias/role.alias";
import { Role } from "src/core/model/role.model";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";

@Injectable()
export class RoleService {
        constructor(private readonly roleRepository: RoleRepository) {}

        async createRole(userInfo: TokenPayloadAuth, data: RoleUpsertRequest): Promise<DefaultResult> {
                if (userInfo.role !== "super-admin" && userInfo.role !== "admin") {
                        return composeDefaultResponseResult(StatusCodeUtil.FORBIDDEN);
                }

                const roleEntity: RoleEntity = RoleConverter.convertUpsertRequestToEntity(data);

                await this.roleRepository.createRole(roleEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async getPageRole(userInfo: TokenPayloadAuth, query: RoleQueryParamRequest): Promise<GetPageRolesResult> {
                if (userInfo.role !== "super-admin") {
                        return composeDefaultResponseResult(StatusCodeUtil.FORBIDDEN);
                }

                const roleEntity: PagingData<RoleEntity> = await this.roleRepository.getPageRole(query);

                const role: Role[] = RoleConverter.convertEntitiesToModels(roleEntity.data);
                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: roleEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, role);
        }

        async getRoleyId(userInfo: TokenPayloadAuth, id: string): Promise<GetRoleItemResult> {
                const roleEntity: RoleEntity | null = await this.roleRepository.getRoleById(id);

                if (roleEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const role: Role = RoleConverter.convertEntityToModel(roleEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, role);
        }

        async updateRoleById(userInfo: TokenPayloadAuth, id: string, data: RoleUpsertRequest): Promise<DefaultResult> {
                const roleEntity: RoleEntity | null = await this.roleRepository.getRoleById(id);

                if (roleEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<RoleEntity> = RoleConverter.convertUpdateRequestToEntity(
                        data,
                        roleEntity
                );

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.roleRepository.updateRoleById(roleEntity.id, updateInfo.data);

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteRoleById(userInfo: TokenPayloadAuth, id: string): Promise<DefaultResult> {
                const deletedSuccess: boolean = await this.roleRepository.deleteRoleById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
