import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ChecklistService } from "../service/checklist.service";
import { ChecklistUpsertRequest } from "src/core/model/request/checklist.upsert.request.model";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { ChecklistQueryParamRequest } from "src/core/model/request/checklist.query.param.request.model";
import { GetChecklistItemResult, GetPageChecklistsResult } from "../alias/checklist.alias";
import { CoreSecurity } from "src/core/security/core.security";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { CurrentUser } from "src/core/security/current.user.decorator";

@Controller({
        path: "checklist"
})
@UseGuards(CoreSecurity)
export class ChecklistController {
        private logger: Logger;

        constructor(private readonly checklistService: ChecklistService) {
                this.logger = new Logger(ChecklistController.name);
        }

        @Post()
        createChecklist(@Body() requestBody: ChecklistUpsertRequest, @Res() response: Response): void {
                const requestData: ChecklistUpsertRequest = plainToInstance(ChecklistUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });
                this.checklistService
                        .createChecklist(requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /checklist] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /checklist] Error", error);
                        });
        }

        @Get()
        getPageChecklist(
                @Query() query: ChecklistQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(ChecklistQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.checklistService
                        .getPageChecklist(queryParam)
                        .then((result: GetPageChecklistsResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /checklist] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /checklist] Error`, error);
                        });
        }

        @Get("/user")
        getPageChecklistByUserId(
                @Query() query: ChecklistQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(ChecklistQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                console.log("user", user);

                this.checklistService
                        .getPageChecklistByUserId(user, queryParam)
                        .then((result: GetPageChecklistsResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /checklist/user] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /checklist/user] Error`, error);
                        });
        }

        @Get(":id")
        getChecklistById(@Param("id") id: string, @Req() request: Request, @Res() response: Response): void {
                this.checklistService
                        .getChecklistById(id)
                        .then((result: GetChecklistItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /checklist/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /checklist/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateChecklist(
                @Param("id") id: string,
                @Body() requestBody: ChecklistUpsertRequest,
                @Req() request: Request,
                @Res() response: Response
        ): void {
                const upsertRequest = plainToInstance(ChecklistUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.checklistService
                        .updateChecklistById(id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /checklist/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /checklist/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteChecklistById(@Param("id") id: string, @Res() response: Response): void {
                this.checklistService
                        .deleteChecklistById(id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /checklist/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /checklist/${id}] Error`, error);
                        });
        }
}
