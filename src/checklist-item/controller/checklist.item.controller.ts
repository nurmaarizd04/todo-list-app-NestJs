import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { CoreSecurity } from "src/core/security/core.security";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { CurrentUser } from "src/core/security/current.user.decorator";
import { ChecklistItemService } from "../service/checklist.item.service";
import { ChecklistItemUpsertRequest } from "src/core/model/request/checklist.item.upsert.request.model";
import { ChecklistItemQueryParamRequest } from "src/core/model/request/checklist.item.query.param.request";
import { GetChecklistItemResult, GetPageChecklistItemsResult } from "../alias/checklist.item.alias";

@Controller({
        path: "checklist-item"
})
@UseGuards(CoreSecurity)
export class ChecklistItemController {
        private logger: Logger;

        constructor(private readonly checklistItemService: ChecklistItemService) {
                this.logger = new Logger(ChecklistItemController.name);
        }

        @Post()
        createChecklistItem(@Body() requestBody: ChecklistItemUpsertRequest, @Res() response: Response): void {
                const requestData: ChecklistItemUpsertRequest = plainToInstance(
                        ChecklistItemUpsertRequest,
                        requestBody,
                        {
                                enableCircularCheck: true
                        }
                );
                this.checklistItemService
                        .createChecklistItem(requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /checklist-item] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /checklist-item] Error", error);
                        });
        }

        @Get()
        getPageChecklistItems(
                @Query() query: ChecklistItemQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(ChecklistItemQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.checklistItemService
                        .getPageChecklistItem(queryParam)
                        .then((result: GetPageChecklistItemsResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /checklist-item] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /checklist-item] Error`, error);
                        });
        }

        @Get(":id")
        getChecklistItemById(@Param("id") id: string, @Req() request: Request, @Res() response: Response): void {
                this.checklistItemService
                        .getChecklistItemById(id)
                        .then((result: GetChecklistItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /checklist-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /checklist-item/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateChecklistItem(
                @Param("id") id: string,
                @Body() requestBody: ChecklistItemUpsertRequest,
                @Req() request: Request,
                @Res() response: Response
        ): void {
                const upsertRequest = plainToInstance(ChecklistItemUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.checklistItemService
                        .updateChecklistItemById(id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /checklist-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /checklist-item/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteChecklistItemById(@Param("id") id: string, @Res() response: Response): void {
                this.checklistItemService
                        .deleteChecklistItemById(id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /checklist-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /checklist-item/${id}] Error`, error);
                        });
        }
}
