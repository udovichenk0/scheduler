import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [RefreshService, PrismaService],
  exports: [RefreshService, PrismaService],
})
export class RefreshModule {}
