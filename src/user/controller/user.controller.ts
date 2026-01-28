import { Body, Controller, Delete, Get, Logger, Param, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { plainToInstance } from "class-transformer";
import { GetPageUsersResult, GetUserItemResult } from "../alias/user.alias";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "src/core/security/current.user.decorator";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { UserUpsertRequest } from "src/core/model/request/user.upsert.request";
import { DefaultResult } from "src/core/alias/core.alias";

@Controller({
        path: "user"
})
@UseGuards(AuthGuard("jwt"))
export class UserController {
        private logger: Logger;

        constructor(private readonly userService: UserService) {
                this.logger = new Logger(UserController.name);
        }

        @Get()
        getPageUser(@Query() query: UserQueryParamRequest, @Res() response: Response): void {
                const queryParam: UserQueryParamRequest = plainToInstance(UserQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.userService
                        .getPageUser(queryParam)
                        .then((result: GetPageUsersResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /user] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[GET /user] Error", error);
                        });
        }

        @Get(":id")
        getUserById(@Param("id") id: string, @Req() request: Request, @Res() response: Response): void {
                this.userService
                        .getUserById(id)
                        .then((result: GetUserItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /user/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /user/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateUserById(
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Param("id") id: string,
                @Body() requestBody: UserUpsertRequest,
                @Res() response: Response
        ): void {
                const upsertRequest: UserUpsertRequest = plainToInstance(UserUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.userService
                        .updateUserById(userInfo, id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /user/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /user/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteUserById(
                @CurrentUser() userInfo: TokenPayloadAuth,
                @Param("id") id: string,
                @Res() response: Response
        ): void {
                this.userService
                        .deleteUserById(userInfo, id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /user/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /user/${id}] Error`, error);
                        });
        }
}
