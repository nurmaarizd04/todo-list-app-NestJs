import { RoleEntity } from "src/core/entity/role.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { RoleQueryParamRequest } from "src/core/model/request/role.query.param.request";

export abstract class RoleRepository {
        abstract createRole(entity: RoleEntity): Promise<RoleEntity>;

        abstract getPageRole(query: RoleQueryParamRequest): Promise<PagingData<RoleEntity>>;

        abstract getRoleById(id: string): Promise<RoleEntity | null>;

        abstract updateRoleById(id: string, entity: RoleEntity): Promise<boolean>;

        abstract deleteRoleById(id: string): Promise<boolean>;
}
