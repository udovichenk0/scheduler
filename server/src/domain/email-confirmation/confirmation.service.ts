import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ConfirmationService {
  constructor(private prismaService: PrismaService) {}
  deleteOne(id: string) {
    return this.prismaService.emailConfirmation.delete({
      where: {
        user_id: id,
      },
    });
  }
  createOne(data: { code: string; user_id: string }) {
    return this.prismaService.emailConfirmation.create({
      data,
    });
  }

  findOne(user_id: string) {
    return this.prismaService.emailConfirmation.findUnique({
      where: {
        user_id,
      },
    });
  }
}
