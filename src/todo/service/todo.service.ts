import { Injectable } from "@nestjs/common";
import { TodoRepository } from "../repository/todo.repository";
import { TodoUpsertRequest } from "src/core/model/request/todo.upsert.request.model";
import { DefaultResult } from "src/core/alias/core.alias";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { TodoConverter } from "../converter/todo.converter";
import { TodoQueryParamRequest } from "src/core/model/request/todo.query.param.request.model";
import { GetPageTodosResult, GetTodoItemResult } from "../alias/todo.alias";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { Todo } from "src/core/model/todo.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { UserEntity } from "src/core/entity/user.entity";
import { UserRepository } from "src/user/repository/user.repository";
import { TokenPayloadAuth } from "src/core/model/internal/token.payload.auth";
import { TodoEntity } from "src/core/entity/todo.entity";

@Injectable()
export class TodoService {
        constructor(
                private readonly todoRepository: TodoRepository,
                private readonly UserRepository: UserRepository
        ) {}

        async createTodo(data: TodoUpsertRequest): Promise<DefaultResult> {
                const userEntity: UserEntity | null = await this.UserRepository.getUserById(data.userId);
                if (userEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const todoEntity: TodoEntity = TodoConverter.convertUpsertRequestToEntity(data);

                await this.todoRepository.createTodo(todoEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async getPageTodo(query: TodoQueryParamRequest): Promise<GetPageTodosResult> {
                const todoEntity: PagingData<TodoEntity> = await this.todoRepository.getPageTodo(query);

                const todo: Todo[] = TodoConverter.convertEntitiesToModels(todoEntity.data);

                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: todoEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, todo);
        }

        async getPageTodoByUserId(user: TokenPayloadAuth, query: TodoQueryParamRequest): Promise<GetPageTodosResult> {
                const todoEntity: PagingData<TodoEntity> = await this.todoRepository.getPageTodoByUserId(
                        user.id,
                        query
                );

                const todo: Todo[] = TodoConverter.convertEntitiesToModels(todoEntity.data);

                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: todoEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, todo);
        }

        async getTodoById(id: string): Promise<GetTodoItemResult> {
                const todoEntity: TodoEntity | null = await this.todoRepository.getTodoById(id);

                if (todoEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const todo: Todo = TodoConverter.convertEntityToModel(todoEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, todo);
        }

        async updateTodoById(id: string, data: TodoUpsertRequest): Promise<DefaultResult> {
                const todoEntity: TodoEntity | null = await this.todoRepository.getTodoById(id);

                if (todoEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<TodoEntity> = TodoConverter.convertUpdateRequestToEntity(
                        data,
                        todoEntity
                );

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.todoRepository.updateTodoById(todoEntity.id, updateInfo.data);

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteTodoById(id: string): Promise<DefaultResult> {
                const deletedSuccess: boolean = await this.todoRepository.deleteTodoById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
