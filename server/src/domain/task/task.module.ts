import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TokenGuard } from '../token/guards/token-guard';
import { JWTModule } from '../token/jwtToken/jwt.module';

@Module({
  imports: [JWTModule],
  providers: [PrismaService, TaskService, TokenGuard],
  controllers: [TaskController],
})
export class TaskModule {}
