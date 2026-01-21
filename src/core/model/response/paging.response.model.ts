import { Expose } from "class-transformer";
import { PageInfo } from "../page.info.model";

export class PagingResponse<T> {
        @Expose({ name: "code" })
        code: number;

        @Expose({ name: "message" })
        message: string;

        @Expose({ name: "payload" })
        payload: T[];

        @Expose({ name: "page_info" })
        pageInfo?: PageInfo;
}
