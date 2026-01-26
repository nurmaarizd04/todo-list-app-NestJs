import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { TodoItemRepository } from "../repository/todo.item.repository";
import { TodoItemEntity } from "src/core/entity/todo.item.entity";
import { TodoItemQueryParamRequest } from "src/core/model/request/todo.item.query.param.request";

@Injectable()
export class TodoItemSource extends TodoItemRepository {
        constructor(private readonly todoItemRepository: Repository<TodoItemEntity>) {
                super();
        }

        async createTodoItem(entity: TodoItemEntity): Promise<TodoItemEntity> {
                return await this.todoItemRepository.save(entity);
        }

        async getPageTodoItems(query: TodoItemQueryParamRequest): Promise<PagingData<TodoItemEntity>> {
                const todoItemEntity: TodoItemEntity[] = await this.todoItemRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit
                });

                const count: number = await this.todoItemRepository.count();

                return new PagingData({
                        data: todoItemEntity,
                        total: count
                });
        }

        async getTodoItemById(id: string): Promise<TodoItemEntity | null> {
                return await this.todoItemRepository.findOne({
                        where: { id: id }
                });
        }

        async updateTodoItemById(id: string, entity: TodoItemEntity): Promise<boolean> {
                const result: UpdateResult = await this.todoItemRepository.update({ id: id }, entity);
                return result.affected != undefined && result.affected > 0;
        }

        async deleteTodoItemById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.todoItemRepository.delete({
                        id: id
                });
                return result.affected !== undefined && result.affected !== null;
        }
}
