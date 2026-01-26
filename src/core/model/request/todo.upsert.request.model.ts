import { Expose } from "class-transformer";

export class TodoUpsertRequest {
        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "user_id" })
        userId: string;
}
