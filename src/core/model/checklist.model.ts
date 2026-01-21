import { Expose, Type } from "class-transformer";
import { User } from "./user.model";
import { ChecklistItem } from "./checklist.item.model";

export class Checklist {
        @Expose({ name: "id" })
        id: string;

        @Expose({ name: "title" })
        title: string;

        @Expose({ name: "user_id" })
        userId: string;

        @Expose({ name: "created_at" })
        @Type(() => Number)
        createdAt: bigint;

        @Expose({ name: "updated_at" })
        @Type(() => Number)
        updatedAt?: bigint;

        @Expose({ name: "user" })
        @Type(() => User)
        user: User;

        @Expose({ name: "checklist_items" })
        @Type(() => ChecklistItem)
        checklistItems: ChecklistItem[];
}
