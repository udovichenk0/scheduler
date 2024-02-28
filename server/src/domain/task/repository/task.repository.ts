import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma/prisma.client";
import { Prisma } from "@prisma/client";
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
        ...task,
        user_id
      }))
    });
  }
}
