import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { UserRepository } from "../repository/user.repository";
import { UserSource } from "../source/user.source";
import { UserEntity } from "src/core/entity/user.entity";

export const userProvider = {
        provide: UserRepository,
        useFactory: (dataSource: DataSource) => new UserSource(dataSource.getRepository(UserEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
