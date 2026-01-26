import { TodoItemEntity } from "src/core/entity/todo.item.entity";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { TodoItemUpsertRequest } from "src/core/model/request/todo.item.upsert.request.model";
import { TodotItem } from "src/core/model/todo.item.model";
import { compareBooleanIsDiff, compareStringIsDiff } from "src/core/utils/helper.util";

export class TodoItemConverter {
        static convertUpsertRequestToEntity(request: TodoItemUpsertRequest): TodoItemEntity {
                const todoItemEntity = new TodoItemEntity();
                todoItemEntity.title = request.title;
                todoItemEntity.isCompleted = request.isCompleted;
                todoItemEntity.todoId = request.todoId;
                todoItemEntity.createdAt = BigInt(Date.now());
                return todoItemEntity;
        }

        static convertEntitiesToModels(entities: TodoItemEntity[]): TodotItem[] {
                return entities.map((entity: TodoItemEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: TodoItemEntity): TodotItem {
                const todotItem: TodotItem = new TodotItem();

                todotItem.id = entity.id;
                todotItem.title = entity.title;
                todotItem.isCompleted = entity.isCompleted;
                todotItem.todoId = entity.todoId;
                todotItem.createdAt = entity.createdAt;
                todotItem.updatedAt = entity.updatedAt;

                return todotItem;
        }

        static convertUpdateRequestToEntity(
                data: TodoItemUpsertRequest,
                currentEntity: TodoItemEntity
        ): ConverterUpdateInfo<TodoItemEntity> {
                let hasDiff = false;

                if (compareStringIsDiff(currentEntity.title, data.title)) {
                        currentEntity.title = data.title;
                        hasDiff = true;
                }

                if (compareBooleanIsDiff(currentEntity.isCompleted, data.isCompleted)) {
                        currentEntity.isCompleted = data.isCompleted;
                        hasDiff = true;
                }

                if (compareStringIsDiff(currentEntity.todoId, data.todoId)) {
                        currentEntity.todoId = data.todoId;
                        hasDiff = true;
                }

                if (hasDiff) {
                        currentEntity.updatedAt = BigInt(Date.now());
                }

                return new ConverterUpdateInfo<TodoItemEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }
}
