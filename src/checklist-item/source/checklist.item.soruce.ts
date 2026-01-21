import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { ChecklistItemRepository } from "../repository/checklist.item.repository";
import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";
import { ChecklistItemQueryParamRequest } from "src/core/model/request/checklist.item.query.param.request";

@Injectable()
export class ChecklistItemSource extends ChecklistItemRepository {
        constructor(private readonly checklistItemRepository: Repository<ChecklistItemEntity>) {
                super();
        }

        async createChecklistItem(entity: ChecklistItemEntity): Promise<ChecklistItemEntity> {
                return await this.checklistItemRepository.save(entity);
        }

        async getPageChecklistItems(query: ChecklistItemQueryParamRequest): Promise<PagingData<ChecklistItemEntity>> {
                const contentEntities: ChecklistItemEntity[] = await this.checklistItemRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit
                });

                const count: number = await this.checklistItemRepository.count();

                return new PagingData({
                        data: contentEntities,
                        total: count
                });
        }

        async getChecklistItemById(id: string): Promise<ChecklistItemEntity | null> {
                return await this.checklistItemRepository.findOne({
                        where: { id: id }
                });
        }

        async updateChecklistItemById(id: string, entity: ChecklistItemEntity): Promise<boolean> {
                const result: UpdateResult = await this.checklistItemRepository.update({ id: id }, entity);
                return result.affected != undefined && result.affected > 0;
        }

        async deleteChecklistItemById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.checklistItemRepository.delete({
                        id: id
                });
                return result.affected !== undefined && result.affected !== null;
        }
}
