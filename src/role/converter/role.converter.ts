import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { compareStringIsDiff } from "src/core/utils/helper.util";
import { RoleUpsertRequest } from "src/core/model/request/role.upsert.request.model";
import { RoleEntity } from "src/core/entity/role.entity";
import { Role } from "src/core/model/role.model";

export class RoleConverter {
        static convertUpsertRequestToEntity(request: RoleUpsertRequest): RoleEntity {
                const roleEntity: RoleEntity = new RoleEntity();

                roleEntity.name = this.toSlug(request.name);
                roleEntity.createdAt = BigInt(Date.now());

                return roleEntity;
        }

        static convertEntitiesToModels(entities: RoleEntity[]): Role[] {
                return entities.map((entity: RoleEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: RoleEntity): Role {
                const role: Role = new Role();

                role.id = entity.id;
                role.name = entity.name;
                role.createdAt = entity.createdAt;
                role.updatedAt = entity.updatedAt;

                return role;
        }

        static convertUpdateRequestToEntity(
                data: RoleUpsertRequest,
                currentEntity: RoleEntity
        ): ConverterUpdateInfo<RoleEntity> {
                let hasDiff = false;

                const slugName = this.toSlug(data.name);

                if (compareStringIsDiff(currentEntity.name, slugName)) {
                        currentEntity.name = slugName;
                        hasDiff = true;
                }

                if (hasDiff) {
                        currentEntity.updatedAt = BigInt(Date.now());
                }

                return new ConverterUpdateInfo<RoleEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }

        private static toSlug(value: string) {
                return value
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "-") // spasi → -
                        .replace(/[^a-z0-9-]/g, "") // hapus karakter aneh
                        .replace(/-+/g, "-");
        }
}
