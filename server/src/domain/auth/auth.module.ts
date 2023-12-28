import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/database/prisma.service';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { ConfirmationService } from '../email-confirmation/confirmation.service';

@Module({
  imports: [TokenModule],
  providers: [AuthService, PrismaService, UserService, ConfirmationService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
