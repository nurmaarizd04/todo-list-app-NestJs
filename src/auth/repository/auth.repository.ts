import { UserEntity } from "src/core/entity/user.entity";

export abstract class AuthRepository {
        abstract createRegisterUser(entity: UserEntity): Promise<UserEntity>;

        abstract getUserByEmail(email: string): Promise<UserEntity | null>;

        abstract getUserById(id: string): Promise<UserEntity | null>;
}
