import { Injectable } from "@nestjs/common";
import { DefaultResult } from "src/core/alias/core.alias";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { TodoItemRepository } from "../repository/todo.item.repository";
import { TodoItemUpsertRequest } from "src/core/model/request/todo.item.upsert.request.model";
import { TodoItemEntity } from "src/core/entity/todo.item.entity";
import { TodoItemConverter } from "../converter/todo.item.converter";
import { GetPageTodoItemsResult, GetTodoItemResult } from "../alias/todo.item.alias";
import { TodoItemQueryParamRequest } from "src/core/model/request/todo.item.query.param.request";
import { TodotItem } from "src/core/model/todo.item.model";

@Injectable()
export class TodoItemService {
        constructor(private readonly todoItemRepository: TodoItemRepository) {}

        async createTodoItem(data: TodoItemUpsertRequest): Promise<DefaultResult> {
                const todoItemEntity: TodoItemEntity = TodoItemConverter.convertUpsertRequestToEntity(data);

                await this.todoItemRepository.createTodoItem(todoItemEntity);

                return composeDefaultResponseResult(StatusCodeUtil.CREATED);
        }

        async getPageTodoItems(query: TodoItemQueryParamRequest): Promise<GetPageTodoItemsResult> {
                const todoItemEntity: PagingData<TodoItemEntity> =
                        await this.todoItemRepository.getPageTodoItems(query);

                const todotItem: TodotItem[] = TodoItemConverter.convertEntitiesToModels(todoItemEntity.data);
                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: todoItemEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, todotItem);
        }

        async getTodoItemById(id: string): Promise<GetTodoItemResult> {
                const todoItemEntity: TodoItemEntity | null = await this.todoItemRepository.getTodoItemById(id);

                if (todoItemEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const todotItem: TodotItem = TodoItemConverter.convertEntityToModel(todoItemEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, todotItem);
        }

        async updateTodoItemById(id: string, data: TodoItemUpsertRequest): Promise<DefaultResult> {
                const todoItemEntity: TodoItemEntity | null = await this.todoItemRepository.getTodoItemById(id);

                if (todoItemEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const updateInfo: ConverterUpdateInfo<TodoItemEntity> = TodoItemConverter.convertUpdateRequestToEntity(
                        data,
                        todoItemEntity
                );

                if (!updateInfo.hasDiff) {
                        return composeDefaultResponseResult(StatusCodeUtil.OK);
                }

                const resultSuccess: boolean = await this.todoItemRepository.updateTodoItemById(
                        todoItemEntity.id,
                        updateInfo.data
                );

                if (!resultSuccess) {
                        return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                }

                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }

        async deleteTodoItemById(id: string): Promise<DefaultResult> {
                const deletedSuccess: boolean = await this.todoItemRepository.deleteTodoItemById(id);

                if (deletedSuccess === false) return composeDefaultResponseResult(StatusCodeUtil.INTERNAL_SERVER_ERROR);
                return composeDefaultResponseResult(StatusCodeUtil.OK);
        }
}
