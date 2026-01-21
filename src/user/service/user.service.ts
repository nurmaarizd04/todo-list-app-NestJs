import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repository/user.repository";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";
import { GetPageUsersResult, GetUserItemResult } from "../alias/user.alias";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { UserEntity } from "src/core/entity/user.entity";
import { User } from "src/core/model/user.model";
import { UserConverter } from "../converter/user.converter";
import { buildPageInfo } from "src/core/utils/page.info.util";
import { PageInfo } from "src/core/model/page.info.model";
import { composeDefaultResponseResult, composePagingResponseResult } from "src/core/utils/response.util";
import { StatusCodeUtil } from "src/core/utils/status.code.util";

@Injectable()
export class UserService {
        constructor(private readonly userRepository: UserRepository) {}

        async getPageUser(query: UserQueryParamRequest): Promise<GetPageUsersResult> {
                const userEntity: PagingData<UserEntity> = await this.userRepository.getPageUser(query);

                const checklist: User[] = UserConverter.convertEntitiesToModels(userEntity.data);
                const pageInfo: PageInfo = buildPageInfo({
                        requestPage: query.page,
                        requestLimit: query.limit,
                        totalCount: userEntity.total
                });

                return composePagingResponseResult(StatusCodeUtil.OK, pageInfo, checklist);
        }

        async getUserById(id: string): Promise<GetUserItemResult> {
                const UserEntity: UserEntity | null = await this.userRepository.getUserById(id);

                if (UserEntity === null) {
                        return composeDefaultResponseResult(StatusCodeUtil.NOT_FOUND);
                }

                const user: User = UserConverter.convertEntityToModel(UserEntity);

                return composeDefaultResponseResult(StatusCodeUtil.OK, user);
        }
}
