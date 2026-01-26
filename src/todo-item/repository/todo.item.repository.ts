import { TodoItemEntity } from "src/core/entity/todo.item.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { TodoItemQueryParamRequest } from "src/core/model/request/todo.item.query.param.request";

export abstract class TodoItemRepository {
        abstract createTodoItem(entity: TodoItemEntity): Promise<TodoItemEntity>;

        abstract getPageTodoItems(query: TodoItemQueryParamRequest): Promise<PagingData<TodoItemEntity>>;

        abstract getTodoItemById(id: string): Promise<TodoItemEntity | null>;

        abstract updateTodoItemById(id: string, entity: TodoItemEntity): Promise<boolean>;

        abstract deleteTodoItemById(id: string): Promise<boolean>;
}
