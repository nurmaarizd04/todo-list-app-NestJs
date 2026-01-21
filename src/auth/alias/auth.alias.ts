import { AppResponse } from "src/core/model/response/app.response.model";
import { Credential } from "../../core/model/credential.model";
import { DefaultResponse } from "../../core/model/response/default.response.model";

export type LoginResult = AppResponse<DefaultResponse<Credential>>;
