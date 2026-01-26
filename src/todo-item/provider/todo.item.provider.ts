import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { TodoItemRepository } from "../repository/todo.item.repository";
import { TodoItemSource } from "../source/todo.item.soruce";
import { TodoItemEntity } from "src/core/entity/todo.item.entity";

export const todoItemProvider = {
        provide: TodoItemRepository,
        useFactory: (dataSource: DataSource) => new TodoItemSource(dataSource.getRepository(TodoItemEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
