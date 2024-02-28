import { Module } from "@nestjs/common";
import { TaskRepository } from "./task.repository";
import { PrismaService } from "src/services/clients/prisma";

@Module({
  providers: [TaskRepository, PrismaService],
  exports: [TaskRepository, PrismaService]
})
export class TaskRepositoryModule {}
