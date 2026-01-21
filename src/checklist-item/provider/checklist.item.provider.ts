import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { ChecklistItemRepository } from "../repository/checklist.item.repository";
import { ChecklistItemSource } from "../source/checklist.item.soruce";
import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";

export const checklistItemProvider = {
        provide: ChecklistItemRepository,
        useFactory: (dataSource: DataSource) => new ChecklistItemSource(dataSource.getRepository(ChecklistItemEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
