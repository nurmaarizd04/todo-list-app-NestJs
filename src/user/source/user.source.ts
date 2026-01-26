import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { UserRepository } from "../repository/user.repository";
import { UserEntity } from "src/core/entity/user.entity";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";

@Injectable()
export class UserSource extends UserRepository {
        constructor(private readonly userRepository: Repository<UserEntity>) {
                super();
        }

        async getPageUser(query: UserQueryParamRequest): Promise<PagingData<UserEntity>> {
                const contentEntities: UserEntity[] = await this.userRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit
                });

                const count: number = await this.userRepository.count({});

                return new PagingData({
                        data: contentEntities,
                        total: count
                });
        }

        async getUserById(id: string): Promise<UserEntity | null> {
                return await this.userRepository.findOne({
                        where: { id: id }
                });
        }
}
