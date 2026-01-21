import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { ChecklistEntity } from "src/core/entity/checklist.entity";
import { ChecklistRepository } from "../repository/checklist.repository";
import { ChecklistQueryParamRequest } from "src/core/model/request/checklist.query.param.request.model";

@Injectable()
export class ChecklistSource extends ChecklistRepository {
        constructor(private readonly checklistRepository: Repository<ChecklistEntity>) {
                super();
        }

        async createChecklist(entity: ChecklistEntity): Promise<ChecklistEntity> {
                return await this.checklistRepository.save(entity);
        }

        async getPageChecklist(query: ChecklistQueryParamRequest): Promise<PagingData<ChecklistEntity>> {
                const contentEntities: ChecklistEntity[] = await this.checklistRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit,
                        relations: { user: true, checklistItems: true }
                });

                const count: number = await this.checklistRepository.count();

                return new PagingData({
                        data: contentEntities,
                        total: count
                });
        }

        async getPageChecklistByUserId(
                id: string,
                query: ChecklistQueryParamRequest
        ): Promise<PagingData<ChecklistEntity>> {
                const contentEntities: ChecklistEntity[] = await this.checklistRepository.find({
                        where: { userId: id },
                        take: query.limit,
                        skip: (query.page - 1) * query.limit,
                        relations: { user: true, checklistItems: true }
                });

                const count: number = await this.checklistRepository.count({ where: { userId: id } });

                return new PagingData({
                        data: contentEntities,
                        total: count
                });
        }

        async getChecklistById(id: string): Promise<ChecklistEntity | null> {
                return await this.checklistRepository.findOne({
                        where: { id: id },
                        relations: { user: true, checklistItems: true }
                });
        }

        async updateChecklistById(id: string, entity: ChecklistEntity): Promise<boolean> {
                const result: UpdateResult = await this.checklistRepository.update({ id: id }, entity);
                return result.affected != undefined && result.affected > 0;
        }

        async deleteChecklistById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.checklistRepository.delete({
                        id: id
                });
                return result.affected !== undefined && result.affected !== null;
        }
}
