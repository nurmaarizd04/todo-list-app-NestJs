import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { PagingData } from "src/core/model/internal/paging.data.model";
import { TodoEntity } from "src/core/entity/todo.entity";
import { TodoRepository } from "../repository/todo.repository";
import { TodoQueryParamRequest } from "src/core/model/request/todo.query.param.request.model";

@Injectable()
export class TodoSource extends TodoRepository {
        constructor(private readonly todoRepository: Repository<TodoEntity>) {
                super();
        }

        async createTodo(entity: TodoEntity): Promise<TodoEntity> {
                return await this.todoRepository.save(entity);
        }

        async getPageTodo(query: TodoQueryParamRequest): Promise<PagingData<TodoEntity>> {
                const todoEntities: TodoEntity[] = await this.todoRepository.find({
                        take: query.limit,
                        skip: (query.page - 1) * query.limit,
                        relations: { user: true, todoItems: true }
                });

                const count: number = await this.todoRepository.count();

                return new PagingData({
                        data: todoEntities,
                        total: count
                });
        }

        async getPageTodoByUserId(id: string, query: TodoQueryParamRequest): Promise<PagingData<TodoEntity>> {
                const todoEntities: TodoEntity[] = await this.todoRepository.find({
                        where: { userId: id },
                        take: query.limit,
                        skip: (query.page - 1) * query.limit,
                        relations: { user: true, todoItems: true },
                        order: {
                                createdAt: "DESC"
                        }
                });

                const count: number = await this.todoRepository.count({ where: { userId: id } });

                return new PagingData({
                        data: todoEntities,
                        total: count
                });
        }

        async getTodoById(id: string): Promise<TodoEntity | null> {
                return await this.todoRepository.findOne({
                        where: { id: id },
                        relations: { user: true, todoItems: true }
                });
        }

        async updateTodoById(id: string, entity: TodoEntity): Promise<boolean> {
                const result = await this.todoRepository.update(
                        { id },
                        {
                                title: entity.title,
                                userId: entity.userId,
                                updatedAt: entity.updatedAt
                        }
                );

                return !!result.affected && result.affected > 0;
        }

        async deleteTodoById(id: string): Promise<boolean> {
                const result: DeleteResult = await this.todoRepository.delete({
                        id: id
                });
                return result.affected !== undefined && result.affected !== null;
        }
}
