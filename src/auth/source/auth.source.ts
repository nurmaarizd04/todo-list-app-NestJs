import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { AuthRepository } from "../repository/auth.repository";
import { UserEntity } from "src/core/entity/user.entity";

@Injectable()
export class AuthSource extends AuthRepository {
        constructor(private readonly userRepository: Repository<UserEntity>) {
                super();
        }

        async createRegisterUser(entity: UserEntity): Promise<UserEntity> {
                return this.userRepository.save(entity);
        }

        async getUserByEmail(email: string): Promise<UserEntity | null> {
                return await this.userRepository.findOne({
                        where: { email: email },
                        relations: { role: true }
                });
        }

        async getUserById(id: string): Promise<UserEntity | null> {
                return await this.userRepository.findOne({
                        where: { id: id },
                        relations: { role: true }
                });
        }
}
