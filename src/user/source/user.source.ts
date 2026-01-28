import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { UserRepository } from "../repository/user.repository";
import { UserEntity } from "src/core/entity/user.entity";
import { UserQueryParamRequest } from "src/core/model/request/user.query.param.request";
import { UpdateResult } from "typeorm/browser";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export class UserSource extends UserRepository {
        constructor(private readonly userRepository: Repository<UserEntity>) {
                super();
        }

        async getPageUser(query: UserQueryParamRequest): Promise<PagingData<UserEntity>> {
                const contentEntities: UserEntity[] = await this.userRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit,
                        relations: { role: true }
                });

                const count: number = await this.userRepository.count({});

                return new PagingData({
                        data: contentEntities,
                        total: count
                });
        }

        async getUserById(id: string): Promise<UserEntity | null> {
                return await this.userRepository.findOne({
                        where: { id: id },
                        relations: { role: true }
                });
        }

        async updateUserById(id: string, entity: UserEntity): Promise<boolean> {
                const result: UpdateResult = await this.userRepository.update({ id: id }, entity);
                return result.affected != undefined && result.affected > 0;
        }

        async deleteUserById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.userRepository.delete({ id: id });
                return result.affected != undefined && result.affected > 0;
        }
}
