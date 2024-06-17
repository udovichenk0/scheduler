import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}
  async findById(id: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id
      }
    });
  }
  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email
      }
    });
  }
  async create(data: { hash: string; email: string }) {
    return await this.prismaService.user.create({
      data: {
        id: uuidv4(),
        ...data
      }
    });
  }
  async deleteById(id: string) {
    return await this.prismaService.user.delete({
      where: { id }
    });
  }
  async verifyById(id: string) {
    return await this.prismaService.user.update({
      where: {
        id
      },
      data: {
        verified: true
      }
    });
  }
}
