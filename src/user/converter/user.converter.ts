import { UserEntity } from "src/core/entity/user.entity";
import { User } from "src/core/model/user.model";
import { RoleConverter } from "src/role/converter/role.converter";

export class UserConverter {
        static convertEntitiesToModels(entities: UserEntity[]): User[] {
                return entities.map((entity: UserEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: UserEntity): User {
                const user: User = new User();

                user.id = entity.id;
                user.username = entity.username;
                user.email = entity.email;
                user.createdAt = entity.createdAt;
                user.updatedAt = entity.updatedAt;

                user.role = entity.role ? RoleConverter.convertEntityToModel(entity.role) : null;

                return user;
        }
}
