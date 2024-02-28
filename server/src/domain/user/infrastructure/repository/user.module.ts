import { Module } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { PrismaService } from "src/services/clients/prisma";

@Module({
  providers: [PrismaService, UserRepository],
  exports: [PrismaService, UserRepository]
})
export class UserRepositoryModule {}
