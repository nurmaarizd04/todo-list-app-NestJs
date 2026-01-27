import { Controller, Get, Logger, Param, Query, Req, Res, UseGuards } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { plainToInstance } from "class-transformer";
import { GetPageUsersResult, GetUserItemResult } from "../alias/user.alias";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";

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

                // const tokenPayload: TokenPayload = parseTokenPayload(request);

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
}
