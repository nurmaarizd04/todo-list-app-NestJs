import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DefaultResult } from "src/core/alias/core.alias";
import { sendInternalServerErrorResponse, sendResponseByResult } from "src/core/utils/response.util";
import { Request, Response } from "express";
import { CoreSecurity } from "src/core/security/core.security";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { CurrentUser } from "src/core/security/current.user.decorator";
import { TodoItemService } from "../service/todo.item.service";
import { TodoItemUpsertRequest } from "src/core/model/request/todo.item.upsert.request.model";
import { TodoItemQueryParamRequest } from "src/core/model/request/todo.item.query.param.request";
import { GetPageTodoItemsResult, GetTodoItemResult } from "../alias/todo.item.alias";

@Controller({
        path: "todo-item"
})
@UseGuards(CoreSecurity)
export class TodoItemController {
        private logger: Logger;

        constructor(private readonly todoItemService: TodoItemService) {
                this.logger = new Logger(TodoItemController.name);
        }

        @Post()
        createTodoItem(@Body() requestBody: TodoItemUpsertRequest, @Res() response: Response): void {
                const requestData: TodoItemUpsertRequest = plainToInstance(TodoItemUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });
                this.todoItemService
                        .createTodoItem(requestData)
                        .then((result: DefaultResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[POST /todo-item] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error("[POST /todo-item] Error", error);
                        });
        }

        @Get()
        getPageTodoItems(
                @Query() query: TodoItemQueryParamRequest,
                @CurrentUser() user: TokenPayloadAuth,
                @Res() response: Response
        ): void {
                const queryParam = plainToInstance(TodoItemQueryParamRequest, query, {
                        exposeDefaultValues: true
                });

                this.todoItemService
                        .getPageTodoItems(queryParam)
                        .then((result: GetPageTodoItemsResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /todo-item] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GETtodo-item] Error`, error);
                        });
        }

        @Get(":id")
        getTodoItemById(@Param("id") id: string, @Req() request: Request, @Res() response: Response): void {
                this.todoItemService
                        .getTodoItemById(id)
                        .then((result: GetTodoItemResult): void => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[GET /todo-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error): void => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[GET /todo-item/${id}] Error`, error);
                        });
        }

        @Put(":id")
        updateTodoItemById(
                @Param("id") id: string,
                @Body() requestBody: TodoItemUpsertRequest,
                @Req() request: Request,
                @Res() response: Response
        ): void {
                const upsertRequest = plainToInstance(TodoItemUpsertRequest, requestBody, {
                        enableCircularCheck: true
                });

                this.todoItemService
                        .updateTodoItemById(id, upsertRequest)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[PUT /todo-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[PUT /todo-item/${id}] Error`, error);
                        });
        }

        @Delete(":id")
        deleteTodoItemById(@Param("id") id: string, @Res() response: Response): void {
                this.todoItemService
                        .deleteTodoItemById(id)
                        .then((result: DefaultResult) => {
                                sendResponseByResult(response, result);
                                this.logger.log(`[DELETE /todo-item/${id}] ${result.statusCode.message}`);
                        })
                        .catch((error) => {
                                sendInternalServerErrorResponse(response);
                                this.logger.error(`[DELETE /todo-item/${id}] Error`, error);
                        });
        }
}
