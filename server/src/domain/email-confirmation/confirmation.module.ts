import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ConfirmationService } from './confirmation.service';

@Module({
  providers: [PrismaService, ConfirmationService],
})
export class EmailConfirmationModule {}
