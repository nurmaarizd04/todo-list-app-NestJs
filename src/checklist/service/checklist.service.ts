import { Injectable } from "@nestjs/common";
import { ChecklistRepository } from "../repository/checklist.repository";
import { ChecklistUpsertRequest } from "src/core/model/request/checklist.upsert.request.model";
import { DefaultResult } from "src/core/alias/core.alias";
import { ChecklistEntity } from "src/core/entity/checklist.entity";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { ChecklistConverter } from "../converter/checklist.converter";
import { ChecklistQueryParamRequest } from "src/core/model/request/checklist.query.param.request.model";
import { GetChecklistItemResult, GetPageChecklistsResult } from "../alias/checklist.alias";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { Checklist } from "src/core/model/checklist.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { UserEntity } from "src/core/entity/user.entity";
import { UserRepository } from "src/user/repository/user.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";

@Injectable()
export class ChecklistService {
        constructor(
                private readonly checklistRepository: ChecklistRepository,
                private readonly UserRepository: UserRepository
        ) {}

        async createChecklist(data: ChecklistUpsertRequest): Promise<DefaultResult> {
                const userEntity: UserEntity | null = await this.UserRepository.getUserById(data.userId);
                if (userEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const checklistEntity: ChecklistEntity = ChecklistConverter.convertUpsertRequestToEntity(data);

                await this.checklistRepository.createChecklist(checklistEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async getPageChecklist(query: ChecklistQueryParamRequest): Promise<GetPageChecklistsResult> {
                const checklistEntity: PagingData<ChecklistEntity> =
                        await this.checklistRepository.getPageChecklist(query);

                const checklist: Checklist[] = ChecklistConverter.convertEntitiesToModels(checklistEntity.data);

                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: checklistEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, checklist);
        }

        async getPageChecklistByUserId(
                user: TokenPayloadAuth,
                query: ChecklistQueryParamRequest
        ): Promise<GetPageChecklistsResult> {
                const checklistEntity: PagingData<ChecklistEntity> =
                        await this.checklistRepository.getPageChecklistByUserId(user.id, query);

                const checklist: Checklist[] = ChecklistConverter.convertEntitiesToModels(checklistEntity.data);

                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: checklistEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, checklist);
        }

        async getChecklistById(id: string): Promise<GetChecklistItemResult> {
                const checklistEntity: ChecklistEntity | null = await this.checklistRepository.getChecklistById(id);

                if (checklistEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const checklist: Checklist = ChecklistConverter.convertEntityToModel(checklistEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, checklist);
        }

        async updateChecklistById(id: string, data: ChecklistUpsertRequest): Promise<DefaultResult> {
                const checklistEntity: ChecklistEntity | null = await this.checklistRepository.getChecklistById(id);

                if (checklistEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<ChecklistEntity> =
                        ChecklistConverter.convertUpdateRequestToEntity(data, checklistEntity);

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.checklistRepository.updateChecklistById(
                        checklistEntity.id,
                        updateInfo.data
                );

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteChecklistById(id: string): Promise<DefaultResult> {
                const deletedSuccess: boolean = await this.checklistRepository.deleteChecklistById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
