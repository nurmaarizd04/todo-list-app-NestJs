import { Expose, Type } from "class-transformer";
import { Checklist } from "./checklist.model";

export class ChecklistItem {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "is_completed" })
        isCompleted: boolean;

        @Expose({ name: "checklist_id" })
        checklistId: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;

        @Expose({ name: "checklist" })
        @Type(() => Checklist)
        checklist: Checklist;
}
