import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma } from '@prisma/client';
import {
  UpdateStatusCredentialDto,
  UpdateTaskCredentialDto,
} from './dto/task.dto';
import { z } from 'zod';
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
}
