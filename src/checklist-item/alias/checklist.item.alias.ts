import { ChecklistItem } from "src/core/model/checklist.item.model";
import { AppResponse } from "src/core/model/response/app.response.model";
import { DefaultResponse } from "src/core/model/response/default.response.model";

export type GetPageChecklistItemsResult = AppResponse<DefaultResponse<ChecklistItem[]>>;
export type GetChecklistItemResult = AppResponse<DefaultResponse<ChecklistItem>>;
