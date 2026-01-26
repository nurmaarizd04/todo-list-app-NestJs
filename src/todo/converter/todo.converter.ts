import { TodoItemConverter } from "src/todo-item/converter/todo.item.converter";
import { TodoEntity } from "src/core/entity/todo.entity";
import { Todo } from "src/core/model/todo.model";
import { ConverterUpdateInfo } from "src/core/model/internal/converter.update.info.model";
import { TodoUpsertRequest } from "src/core/model/request/todo.upsert.request.model";
import { compareStringIsDiff } from "src/core/utils/helper.util";
import { UserConverter } from "src/user/converter/user.converter";

export class TodoConverter {
        static convertUpsertRequestToEntity(request: TodoUpsertRequest): TodoEntity {
                const todoEntity: TodoEntity = new TodoEntity();
                todoEntity.title = request.title;
                todoEntity.userId = request.userId;
                todoEntity.createdAt = BigInt(Date.now());

                return todoEntity;
        }

        static convertEntitiesToModels(entities: TodoEntity[]): Todo[] {
                return entities.map((entity: TodoEntity) => this.convertEntityToModel(entity));
        }

        static convertEntityToModel(entity: TodoEntity): Todo {
                const todo: Todo = new Todo();

                todo.id = entity.id;
                todo.title = entity.title;
                todo.userId = entity.userId;
                todo.createdAt = entity.createdAt;
                todo.updatedAt = entity.updatedAt;

                todo.user = UserConverter.convertEntityToModel(entity.user);
                todo.todoItems = TodoItemConverter.convertEntitiesToModels(entity.todoItems);

                return todo;
        }

        static convertUpdateRequestToEntity(
                data: TodoUpsertRequest,
                currentEntity: TodoEntity
        ): ConverterUpdateInfo<TodoEntity> {
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

                return new ConverterUpdateInfo<TodoEntity>({
                        hasDiff,
                        data: currentEntity
                });
        }
}
