import { Type } from "class-transformer";
import { Expose } from "class-transformer";

export class RoleQueryParamRequest {
        @Type(() => Number)
        @Expose({ name: "page" })
        page: number = 1;

        @Type(() => Number)
        @Expose({ name: "limit" })
        limit: number = 10;
}
