import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { ChecklistItemService } from "../service/checklist.item.service";
import { checklistItemProvider } from "../provider/checklist.item.provider";

@Module({
        imports: [DatabaseModule],
        exports: [ChecklistItemService, checklistItemProvider],
        providers: [checklistItemProvider, ChecklistItemService]
})
export class ChecklistItemModule {}
