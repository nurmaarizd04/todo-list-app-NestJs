import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";
import { User } from "src/core/model/user.model";

export type GetPageUsersResult = AppResponse<DefaultResponse<User[]>>;
export type GetUserItemResult = AppResponse<DefaultResponse<User>>;
