import { Expose } from "class-transformer";

export class ChecklistUpsertRequest {
        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "user_id" })
        userId: string;
}
