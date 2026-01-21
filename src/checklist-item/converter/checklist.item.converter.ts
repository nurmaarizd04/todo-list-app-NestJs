import { ChecklistItemEntity } from "src/core/entity/checklist.item.entity";
import { ChecklistItem } from "src/core/model/checklist.item.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { ChecklistItemUpsertRequest } from "src/core/model/request/checklist.item.upsert.request.model";
import { compareBooleanIsDiff, compareStringIsDiff } from "src/core/utils/helper.util";

export class ChecklistItemConverter {
        static convertUpsertRequestToEntity(request: ChecklistItemUpsertRequest): ChecklistItemEntity {
                const checklistItemEntity = new ChecklistItemEntity();
                checklistItemEntity.title = request.title;
                checklistItemEntity.isCompleted = request.isCompleted;
                checklistItemEntity.checklistId = request.checklistId;
                checklistItemEntity.createdAt = BigInt(Date.now());
                return checklistItemEntity;
        }

        static convertEntitiesToModels(entities: ChecklistItemEntity[]): ChecklistItem[] {
                return entities.map((entity: ChecklistItemEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: ChecklistItemEntity): ChecklistItem {
                const checklistItem: ChecklistItem = new ChecklistItem();

                checklistItem.id = entity.id;
                checklistItem.title = entity.title;
                checklistItem.isCompleted = entity.isCompleted;
                checklistItem.checklistId = entity.checklistId;
                checklistItem.createdAt = entity.createdAt;
                checklistItem.updatedAt = entity.updatedAt;

                return checklistItem;
        }

        static convertUpdateRequestToEntity(
                data: ChecklistItemUpsertRequest,
                currentEntity: ChecklistItemEntity
        ): ConverterUpdateInfo<ChecklistItemEntity> {
                let hasDiff = false;

                if (compareStringIsDiff(currentEntity.title, data.title)) {
                        currentEntity.title = data.title;
                        hasDiff = true;
                }

                if (compareBooleanIsDiff(currentEntity.isCompleted, data.isCompleted)) {
                        currentEntity.isCompleted = data.isCompleted;
                        hasDiff = true;
                }

                if (compareStringIsDiff(currentEntity.checklistId, data.checklistId)) {
                        currentEntity.checklistId = data.checklistId;
                        hasDiff = true;
                }

                if (hasDiff) {
                        currentEntity.updatedAt = BigInt(Date.now());
                }

                return new ConverterUpdateInfo<ChecklistItemEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }
}
