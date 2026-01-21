import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { ChecklistItemQueryParamRequest } from "src/core/model/request/checklist.item.query.param.request";

export abstract class ChecklistItemRepository {
        abstract createChecklistItem(entity: ChecklistItemEntity): Promise<ChecklistItemEntity>;

        abstract getPageChecklistItems(query: ChecklistItemQueryParamRequest): Promise<PagingData<ChecklistItemEntity>>;

        abstract getChecklistItemById(id: string): Promise<ChecklistItemEntity | null>;

        abstract updateChecklistItemById(id: string, entity: ChecklistItemEntity): Promise<boolean>;

        abstract deleteChecklistItemById(id: string): Promise<boolean>;
}
