import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
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
      data,
    });
    return task;
  }
  updateOne({ id, data }: { id: number; data: Prisma.taskUpdateInput }) {
    const task = this.prismaService.task.update({
      data,
      where: {
        id,
      },
    });
    return task;
  }
}
