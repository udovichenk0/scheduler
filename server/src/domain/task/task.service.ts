import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { Prisma } from '@prisma/client';
@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}
  async findMany({ id }: Prisma.taskWhereInput) {
    const tasks = this.prismaService.task.findMany({
      where: {
        user_id: id,
      },
    });
    return tasks;
  }
  createOne(data: Prisma.taskCreateInput) {
    const task = this.prismaService.task.create({
      data: {
        ...data,
      },
    });
    return task;
  }
  updateOne(data: Prisma.taskUpdateInput, id: string) {
    const task = this.prismaService.task.update({
      data,
      where: {
        id,
      },
    });
    return task;
  }
  deleteOne(id: string) {
    const task = this.prismaService.task.delete({
      where: {
        id,
      },
    });
    return task;
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
    const result = await this.prismaService.task.createMany({
      data: data.map((task) => ({
        ...task,
        user_id,
      })),
    });
    if (result.count) {
      return await this.findMany({ id: user_id });
    }
    return null;
  }
}
