import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { AuthRepository } from "../repository/auth.repository";
import { AuthSource } from "../source/auth.source";
import { UserEntity } from "src/core/entity/user.entity";

export const authProvider = {
        provide: AuthRepository,
        useFactory: (dataSource: DataSource) => new AuthSource(dataSource.getRepository(UserEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
