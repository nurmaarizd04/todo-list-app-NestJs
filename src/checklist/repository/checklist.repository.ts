import { ChecklistEntity } from "src/core/entity/checklist.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { ChecklistQueryParamRequest } from "src/core/model/request/checklist.query.param.request.model";

export abstract class ChecklistRepository {
        abstract createChecklist(entity: ChecklistEntity): Promise<ChecklistEntity>;

        abstract getPageChecklist(query: ChecklistQueryParamRequest): Promise<PagingData<ChecklistEntity>>;

        abstract getPageChecklistByUserId(
                id: string,
                query: ChecklistQueryParamRequest
        ): Promise<PagingData<ChecklistEntity>>;

        abstract getChecklistById(id: string): Promise<ChecklistEntity | null>;

        abstract updateChecklistById(id: string, entity: ChecklistEntity): Promise<boolean>;

        abstract deleteChecklistById(id: string): Promise<boolean>;
}
