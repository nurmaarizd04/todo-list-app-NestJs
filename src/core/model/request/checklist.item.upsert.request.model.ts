import { Expose } from "class-transformer";

export class ChecklistItemUpsertRequest {
        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "is_completed" })
        isCompleted: boolean;

        @Expose({ name: "checklist_id" })
        checklistId: string;
}
