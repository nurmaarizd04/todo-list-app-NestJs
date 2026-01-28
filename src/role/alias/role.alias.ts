import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";
import { Role } from "src/core/model/role.model";

export type GetPageRolesResult = AppResponse<DefaultResponse<Role[]>>;
export type GetRoleItemResult = AppResponse<DefaultResponse<Role>>;
