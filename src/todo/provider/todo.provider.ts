import { DataSource } from "typeorm";
import { Constant } from "src/core/utils/constant.util";
import { TodoRepository } from "../repository/todo.repository";
import { TodoSource } from "../source/todo.source";
import { TodoEntity } from "src/core/entity/todo.entity";

export const todoProvider = {
        provide: TodoRepository,
        useFactory: (dataSource: DataSource) => new TodoSource(dataSource.getRepository(TodoEntity)),
        inject: [Constant.KEY_DATA_SOURCE]
};
