import { StatusCode } from "../internal/status.code.model";

export class AppResponse<T> {
        statusCode: StatusCode;
        responseBody: T;
}
