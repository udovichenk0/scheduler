import { v4 as uuidv4 } from "uuid";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma";
import { Prisma } from "prisma/generated";

@Injectable()
export class TaskRepository {
  constructor(private prismaService: PrismaService) {}
  findManyByUserId(user_id: string) {
    return this.prismaService.task.findMany({
      where: {
        user_id
      }
    });
  }
  findMany(where: Prisma.taskWhereInput) {
    return this.prismaService.task.findMany({ where });
  }
  findTaskCount(where: Prisma.taskWhereInput) {
    return this.prismaService.task.count({
      where
    });
  }
  create(data: Prisma.taskCreateInput) {
    return this.prismaService.task.create({
      data: {
        ...data
      }
    });
  }
  updateById(data: Prisma.taskUpdateInput, id: string) {
    return this.prismaService.task.update({
      data,
      where: {
        id
      }
    });
  }
  deleteById(id: string) {
    return this.prismaService.task.delete({
      where: {
        id
      }
    });
  }
  async createManyByUserId({
    user_id,
    data
  }: {
    user_id: string;
    data: Omit<Prisma.taskCreateManyInput, "user_id" | "id">[];
  }) {
    return this.prismaService.task.createMany({
      data: data.map((task) => ({
        id: uuidv4(),
        ...task,
        user_id
      }))
    });
  }
  deleteMany(where: Prisma.taskWhereInput) {
    return this.prismaService.task.deleteMany({
      where
    });
  }
}
