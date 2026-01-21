import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { ChecklistRepository } from "../repository/checklist.repository";
import { ChecklistSource } from "../source/checklist.source";
import { ChecklistEntity } from "src/core/entity/checklist.entity";

export const checklistProvider = {
        provide: ChecklistRepository,
        useFactory: (dataSource: DataSource) => new ChecklistSource(dataSource.getRepository(ChecklistEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
