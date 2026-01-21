import { ChecklistItemConverter } from "src/checklist-item/converter/checklist.item.converter";
import { ChecklistEntity } from "src/core/entity/checklist.entity";
import { Checklist } from "src/core/model/checklist.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { ChecklistUpsertRequest } from "src/core/model/request/checklist.upsert.request.model";
import { compareStringIsDiff } from "src/core/utils/helper.util";
import { UserConverter } from "src/user/converter/user.converter";

export class ChecklistConverter {
        static convertUpsertRequestToEntity(request: ChecklistUpsertRequest): ChecklistEntity {
                const checklistEntity = new ChecklistEntity();
                checklistEntity.title = request.title;
                checklistEntity.userId = request.userId;
                checklistEntity.createdAt = BigInt(Date.now());

                return checklistEntity;
        }

        static convertEntitiesToModels(entities: ChecklistEntity[]): Checklist[] {
                return entities.map((entity: ChecklistEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: ChecklistEntity): Checklist {
                const checklist: Checklist = new Checklist();

                checklist.id = entity.id;
                checklist.title = entity.title;
                checklist.userId = entity.userId;
                checklist.createdAt = entity.createdAt;
                checklist.updatedAt = entity.updatedAt;

                checklist.user = UserConverter.convertEntityToModel(entity.user);
                checklist.checklistItems = ChecklistItemConverter.convertEntitiesToModels(entity.checklistItems);

                return checklist;
        }

        static convertUpdateRequestToEntity(
                data: ChecklistUpsertRequest,
                currentEntity: ChecklistEntity
        ): ConverterUpdateInfo<ChecklistEntity> {
                let hasDiff = false;

                if (compareStringIsDiff(currentEntity.title, data.title)) {
                        currentEntity.title = data.title;
                        hasDiff = true;
                }

                if (compareStringIsDiff(currentEntity.userId, data.userId)) {
                        currentEntity.userId = data.userId;
                        hasDiff = true;
                }

                if (hasDiff) {
                        currentEntity.updatedAt = BigInt(Date.now());
                }

                return new ConverterUpdateInfo<ChecklistEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }
}
