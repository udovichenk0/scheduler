import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { TaskRepository } from "./repository/task.repository";
import { Errors } from "src/services/err/errors";
@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  async findManyByUserId(user_id: string) {
    try {
      return await this.taskRepository.findManyByUserId(user_id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  createOne(data: Prisma.taskCreateInput) {
    try {
      return this.taskRepository.create(data);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  updateOne(data: Prisma.taskUpdateInput, id: string) {
    try {
      return this.taskRepository.updateById(data, id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  deleteOne(id: string) {
    try {
      return this.taskRepository.deleteById(id);
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  async createMany({
    user_id,
    data
  }: {
    user_id: string;
    data: Omit<Prisma.taskCreateManyInput, "user_id" | "id">[];
  }) {
    try {
      if (!data.length) {
        return [];
      }

      const result = await this.taskRepository.createManyByUserId({
        user_id,
        data
      });
      if (result.count) {
        return await this.findManyByUserId(user_id);
      }
      return null;
    } catch (error) {
      return Errors.InternalServerError();
    }
  }
  deleteTrashedTasks(userId: string){
    try {
      if(!userId){
        return Errors.Missing("User id")
      }
      return this.taskRepository.deleteMany({
        user_id: userId,
        AND: {
          is_deleted: true
        }
      })
    } catch (error) {
      return Errors.InternalServerError()
    }
  }
}
