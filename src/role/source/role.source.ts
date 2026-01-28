import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { RoleRepository } from "../repository/role.repository";
import { RoleEntity } from "src/core/entity/role.entity";
import { RoleQueryParamRequest } from "src/core/model/request/role.query.param.request";

@Injectable()
export class RoleSource extends RoleRepository {
        constructor(private readonly roleRepository: Repository<RoleEntity>) {
                super();
        }

        async createRole(entity: RoleEntity): Promise<RoleEntity> {
                return await this.roleRepository.save(entity);
        }

        async getPageRole(query: RoleQueryParamRequest): Promise<PagingData<RoleEntity>> {
                const roleEntities: RoleEntity[] = await this.roleRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit
                });

                const count: number = await this.roleRepository.count();

                return new PagingData({
                        data: roleEntities,
                        total: count
                });
        }

        async getRoleById(id: string): Promise<RoleEntity | null> {
                return await this.roleRepository.findOne({
                        where: { id: id }
                });
        }
        async updateRoleById(id: string, entity: RoleEntity): Promise<boolean> {
                const result: UpdateResult = await this.roleRepository.update({ id: id }, entity);
                return result.affected != undefined && result.affected > 0;
        }

        async deleteRoleById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.roleRepository.delete({ id: id });
                return result.affected != undefined && result.affected > 0;
        }
}
