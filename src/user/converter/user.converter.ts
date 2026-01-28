import { RoleEntity } from "src/core/entity/role.entity";
import { UserEntity } from "src/core/entity/user.entity";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { UserUpsertRequest } from "src/core/model/request/user.upsert.request";
import { User } from "src/core/model/user.model";
import { compareStringIsDiff } from "src/core/utils/helper.util";
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

        static convertUpdateRequestToEntity(
                data: UserUpsertRequest,
                currentEntity: UserEntity,
                roleEntity: RoleEntity
        ): ConverterUpdateInfo<UserEntity> {
                let hasDiff = false;

                if (compareStringIsDiff(currentEntity.username, data.username)) {
                        currentEntity.username = data.username;
                        hasDiff = true;
                }

                if (compareStringIsDiff(currentEntity.email, data.email)) {
                        currentEntity.email = data.email;
                        hasDiff = true;
                }

                if (compareStringIsDiff(currentEntity.role?.id, roleEntity.id)) {
                        currentEntity.role = roleEntity;
                        hasDiff = true;
                }

                if (hasDiff) {
                        currentEntity.updatedAt = BigInt(Date.now());
                }

                return new ConverterUpdateInfo<UserEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }
}
