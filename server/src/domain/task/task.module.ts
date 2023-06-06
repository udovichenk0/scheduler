import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { JWTService } from '../token/jwtToken/jwt.service';
import { TokenGuard } from '../token/guards/token-guard';

@Module({
  providers: [PrismaService, TaskService, TokenGuard, JWTService],
  controllers: [TaskController],
})
export class TaskModule {}
