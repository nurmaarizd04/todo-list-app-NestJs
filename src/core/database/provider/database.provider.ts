import { ConfigService } from "@nestjs/config";
import { ChecklistEntity } from "src/core/entity/checklist.entity";
import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";
import { UserEntity } from "src/core/entity/user.entity";
import { Constant } from "src/core/utils/constant.util";
import { DataSource } from "typeorm";

export const databaseProvider = {
        provide: Constant.KEY_DATA_SOURCE,
        useFactory: (configService: ConfigService) => {
                const dataSource: DataSource = new DataSource({
                        type: "postgres",
                        host: configService.get("APP_TODO_LIST_DATABASE_HOST"),
                        port: configService.get("APP_TODO_LIST_DATABASE_PORT"),
                        username: configService.get("APP_TODO_LIST_DATABASE_USERNAME"),
                        password: configService.get("APP_TODO_LIST_DATABASE_PASSWORD"),
                        database: configService.get("APP_TODO_LIST_DATABASE_NAME"),
                        entities: [UserEntity, ChecklistEntity, ChecklistItemEntity],
                        synchronize: configService.get("APP_TODO_LIST_DATABASE_SYNCHRONIZE")
                });

                return dataSource.initialize();
        },
        inject: [ConfigService]
};
