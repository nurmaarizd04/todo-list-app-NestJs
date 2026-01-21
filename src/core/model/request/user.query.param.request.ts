import { Expose, Type } from "class-transformer";

export class UserQueryParamRequest {
        @Type(() => Number)
        @Expose({ name: "page" })
        page: number = 1;

        @Type(() => Number)
        @Expose({ name: "limit" })
        limit: number = 10;
}
