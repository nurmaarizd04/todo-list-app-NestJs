import { UserEntity } from "src/core/entity/user.entity";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";

export abstract class UserRepository {
        abstract getPageUser(query: UserQueryParamRequest): Promise<PagingData<UserEntity>>;

        abstract getUserById(id: string): Promise<UserEntity | null>;

        abstract updateUserById(id: string, entity: UserEntity): Promise<boolean>;

        abstract deleteUserById(id: string): Promise<boolean>;
}
