import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { ChecklistQueryParamRequest } from "src/core/model/request/checklist.query.param.request.model";
import { UserRepository } from "../repository/user.repository";
import { UserEntity } from "src/core/entity/user.entity";

@Injectable()
export class UserSource extends UserRepository {
        constructor(private readonly userRepository: Repository<UserEntity>) {
                super();
        }

        async getPageUser(query: ChecklistQueryParamRequest): Promise<PagingData<UserEntity>> {
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
