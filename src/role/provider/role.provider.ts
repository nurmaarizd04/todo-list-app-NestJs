import { DataSource } from "typeorm";
import { RoleEntity } from "../../core/entity/role.entity";
import { RoleRepository } from "../repository/role.repository";
import { RoleSource } from "../source/role.source";
import { Constant } from "src/core/utils/constant.util";

export const roleProvider = {
        provide: RoleRepository,
        useFactory: (dataSource: DataSource) => new RoleSource(dataSource.getRepository(RoleEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
