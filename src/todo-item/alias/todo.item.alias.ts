import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";
import { TodotItem } from "src/core/model/todo.item.model";

export type GetPageTodoItemsResult = AppResponse<DefaultResponse<TodotItem[]>>;
export type GetTodoItemResult = AppResponse<DefaultResponse<TodotItem>>;
