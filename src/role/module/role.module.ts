import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/core/database/module/database.module";
import { roleProvider } from "../provider/role.provider";
import { RoleService } from "../service/role.service";

@Module({
        imports: [DatabaseModule],
        exports: [RoleService, roleProvider],
        providers: [roleProvider, RoleService]
})
export class RoleModule {}
