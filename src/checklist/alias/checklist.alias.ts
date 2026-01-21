import { Checklist } from "src/core/model/checklist.model";
import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";

export type GetPageChecklistsResult = AppResponse<DefaultResponse<Checklist[]>>;
export type GetChecklistItemResult = AppResponse<DefaultResponse<Checklist>>;
