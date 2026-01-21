import { Injectable } from "@nestjs/common";
import { DefaultResult } from "src/core/alias/core.alias";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { ChecklistItemUpsertRequest } from "src/core/model/request/checklist.item.upsert.request.model";
import { ChecklistItemRepository } from "../repository/checklist.item.repository";
import { ChecklistItemConverter } from "../converter/checklist.item.converter";
import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";
import { ChecklistItemQueryParamRequest } from "src/core/model/request/checklist.item.query.param.request";
import { GetChecklistItemResult, GetPageChecklistItemsResult } from "../alias/checklist.item.alias";
import { ChecklistItem } from "src/core/model/checklist.item.model";

@Injectable()
export class ChecklistItemService {
        constructor(private readonly checklistItemRepository: ChecklistItemRepository) {}

        async createChecklistItem(data: ChecklistItemUpsertRequest): Promise<DefaultResult> {
                const checklistItemEntity: ChecklistItemEntity =
                        ChecklistItemConverter.convertUpsertRequestToEntity(data);

                await this.checklistItemRepository.createChecklistItem(checklistItemEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async getPageChecklistItem(query: ChecklistItemQueryParamRequest): Promise<GetPageChecklistItemsResult> {
                const checklistItemEntity: PagingData<ChecklistItemEntity> =
                        await this.checklistItemRepository.getPageChecklistItems(query);

                const checklistItem: ChecklistItem[] = ChecklistItemConverter.convertEntitiesToModels(
                        checklistItemEntity.data
                );
                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: checklistItemEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, checklistItem);
        }

        async getChecklistItemById(id: string): Promise<GetChecklistItemResult> {
                const checklistItemEntity: ChecklistItemEntity | null =
                        await this.checklistItemRepository.getChecklistItemById(id);

                if (checklistItemEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const checklistItem: ChecklistItem = ChecklistItemConverter.convertEntityToModel(checklistItemEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, checklistItem);
        }

        async updateChecklistItemById(id: string, data: ChecklistItemUpsertRequest): Promise<DefaultResult> {
                const checklistItemEntity: ChecklistItemEntity | null =
                        await this.checklistItemRepository.getChecklistItemById(id);

                if (checklistItemEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<ChecklistItemEntity> =
                        ChecklistItemConverter.convertUpdateRequestToEntity(data, checklistItemEntity);

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.checklistItemRepository.updateChecklistItemById(
                        checklistItemEntity.id,
                        updateInfo.data
                );

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteChecklistItemById(id: string): Promise<DefaultResult> {
                const deletedSuccess: boolean = await this.checklistItemRepository.deleteChecklistItemById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
