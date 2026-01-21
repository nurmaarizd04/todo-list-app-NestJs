import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { ChecklistService } from "../service/checklist.service";
import { checklistProvider } from "../provider/checklist.provider";
import { UserModule } from "src/user/module/user.module";

@Module({
        imports: [DatabaseModule, UserModule],
        exports: [ChecklistService, checklistProvider],
        providers: [checklistProvider, ChecklistService]
})
export class ChecklistModule {}
