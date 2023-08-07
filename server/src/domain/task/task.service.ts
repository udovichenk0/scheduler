import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
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
        id: uuidv4(),
      },
    });
    return task;
  }
  updateOne({ data, where }: Prisma.taskUpdateArgs) {
    const task = this.prismaService.task.update({
      data,
      where,
    });
    return task;
  }
  updateStatus({ data, where }: Prisma.taskUpdateArgs) {
    const task = this.prismaService.task.update({
      data,
      where,
    });
    return task;
  }
  deleteOne({ where }: Prisma.taskDeleteArgs) {
    const task = this.prismaService.task.delete({
      where,
    });
    return task;
  }
  createMany({
    user_id,
    data,
  }: {
    user_id: string;
    data: Omit<Prisma.taskCreateManyInput, 'user_id'>[];
  }) {
    const tasks = this.prismaService.task.createMany({
      data: data.map((task) => ({
        ...task,
        user_id,
      })),
    });
    return tasks;
  }
}
