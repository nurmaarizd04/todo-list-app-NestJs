import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { TodoService } from "../service/todo.service";
import { TodoUpsertRequest } from "src/core/model/request/todo.upsert.request.model";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { TodoQueryParamRequest } from "src/core/model/request/todo.query.param.request.model";
import { GetPageTodosResult, GetTodoItemResult } from "../alias/todo.alias";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { CurrentUser } from "src/core/security/current.user.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller({
        path: "todo"
})
@UseGuards(AuthGuard("jwt"))
export class TodoController {
        private logger: Logger;

        constructor(private readonly todoService: TodoService) {
                this.logger = new Logger(TodoController.name);
        }

        @Post()
        createTodo(@Body() requestBody: TodoUpsertRequest, @Res() response: Response): void {
                const requestData: TodoUpsertRequest = plainToInstance(TodoUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });
                this.todoService
                        .createTodo(requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /todo] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /todo] Error", error);
                        });
        }

        @Get()
        getPageTodo(
                @Query() query: TodoQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(TodoQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.todoService
                        .getPageTodo(queryParam)
                        .then((result: GetPageTodosResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /todo] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /todo] Error`, error);
                        });
        }

        @Get("/user")
        getPageTodoByUserId(
                @Query() query: TodoQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(TodoQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.todoService
                        .getPageTodoByUserId(user, queryParam)
                        .then((result: GetPageTodosResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /todo/user] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /todo/user] Error`, error);
                        });
        }

        @Get(":id")
        getTodoById(@Param("id") id: string, @Req() request: Request, @Res() response: Response): void {
                this.todoService
                        .getTodoById(id)
                        .then((result: GetTodoItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /todo/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /todo/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateTodoById(
                @Param("id") id: string,
                @Body() requestBody: TodoUpsertRequest,
                @Req() request: Request,
                @Res() response: Response
        ): void {
                const upsertRequest: TodoUpsertRequest = plainToInstance(TodoUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.todoService
                        .updateTodoById(id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /todo/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /todo/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteTodoById(@Param("id") id: string, @Res() response: Response): void {
                this.todoService
                        .deleteTodoById(id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /todo/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /todo/${id}] Error`, error);
                        });
        }
}
