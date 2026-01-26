import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";
import { Todo } from "src/core/model/todo.model";

export type GetPageTodosResult = AppResponse<DefaultResponse<Todo[]>>;
export type GetTodoItemResult = AppResponse<DefaultResponse<Todo>>;
