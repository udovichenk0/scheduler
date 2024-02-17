import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { OTPModule } from '../otp/otp.module.';

@Module({
  imports: [TokenModule, UserModule, OTPModule],
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
