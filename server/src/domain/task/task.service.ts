import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TaskRepository } from './repository/task.repository';
@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}
  async findManyByUserId(user_id: string) {
    return this.taskRepository.findManyByUserId(user_id);
  }
  createOne(data: Prisma.taskCreateInput) {
    return this.taskRepository.create(data);
  }
  updateOne(data: Prisma.taskUpdateInput, id: string) {
    return this.taskRepository.updateById(data, id);
  }
  deleteOne(id: string) {
    return this.taskRepository.deleteById(id);
  }
  async createMany({
    user_id,
    data,
  }: {
    user_id: string;
    data: Omit<Prisma.taskCreateManyInput, 'user_id' | 'id'>[];
  }) {
    if (!data.length) {
      return [];
    }

    const result = await this.taskRepository.createManyByUserId({ user_id, data });
    if (result.count) {
      return await this.findManyByUserId(user_id);
    }
    return null;
  }
}
