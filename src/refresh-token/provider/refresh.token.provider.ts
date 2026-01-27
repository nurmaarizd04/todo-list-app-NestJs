import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { RefreshTokenRepository } from "../repository/refresh.token.repository";
import { RefreshTokenEntity } from "src/core/entity/refresh.token.entity";
import { RefreshTokenSource } from "../source/refresh.token.source";

export const refreshTokenProvider = {
        provide: RefreshTokenRepository,
        useFactory: (dataSource: DataSource) => new RefreshTokenSource(dataSource.getRepository(RefreshTokenEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
