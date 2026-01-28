import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { CurrentUser } from "src/core/security/current.user.decorator";
import { AuthGuard } from "@nestjs/passport";
import { RoleService } from "../service/role.service";
import { RoleUpsertRequest } from "src/core/model/request/role.upsert.request.model";
import { RoleQueryParamRequest } from "src/core/model/request/role.query.param.request";
import { GetPageRolesResult, GetRoleItemResult } from "../alias/role.alias";

@Controller({
        path: "role"
})
@UseGuards(AuthGuard("jwt"))
export class RoleController {
        private logger: Logger;

        constructor(private readonly roleService: RoleService) {
                this.logger = new Logger(RoleController.name);
        }

        @Post()
        createRole(
                @Body() requestBody: RoleUpsertRequest,
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const requestData: RoleUpsertRequest = plainToInstance(RoleUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });
                this.roleService
                        .createRole(userInfo, requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /role] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /role] Error", error);
                        });
        }

        @Get()
        getPageRole(
                @Query() query: RoleQueryParamRequest,
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(RoleQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.roleService
                        .getPageRole(userInfo, queryParam)
                        .then((result: GetPageRolesResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /role] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /role] Error`, error);
                        });
        }

        @Get(":id")
        getRoleyId(
                @Param("id") id: string,
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                this.roleService
                        .getRoleyId(userInfo, id)
                        .then((result: GetRoleItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /role/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /role/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateRoleById(
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Param("id") id: string,
                @Body() requestBody: RoleUpsertRequest,
                @Res() response: Response
        ): void {
                const upsertRequest: RoleUpsertRequest = plainToInstance(RoleUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.roleService
                        .updateRoleById(userInfo, id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /role/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /role/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteRoleById(
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Param("id") id: string,
                @Res() response: Response
        ): void {
                this.roleService
                        .deleteRoleById(userInfo, id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /role/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /role/${id}] Error`, error);
                        });
        }
}
