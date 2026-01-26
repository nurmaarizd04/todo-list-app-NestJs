import { TodoEntity } from "src/core/entity/todo.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { TodoQueryParamRequest } from "src/core/model/request/todo.query.param.request.model";

export abstract class TodoRepository {
        abstract createTodo(entity: TodoEntity): Promise<TodoEntity>;

        abstract getPageTodo(query: TodoQueryParamRequest): Promise<PagingData<TodoEntity>>;

        abstract getPageTodoByUserId(id: string, query: TodoQueryParamRequest): Promise<PagingData<TodoEntity>>;

        abstract getTodoById(id: string): Promise<TodoEntity | null>;

        abstract updateTodoById(id: string, entity: TodoEntity): Promise<boolean>;

        abstract deleteTodoById(id: string): Promise<boolean>;
}
