import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [RefreshService],
  exports: [RefreshService],
})
export class RefreshModule {}
