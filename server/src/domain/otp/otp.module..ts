import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/clients/prisma/prisma.client';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { UserService } from '../user/user.service';

@Module({
  providers: [PrismaService, OTPService, UserService],
  controllers: [OTPController],
  exports: [OTPService]
})
export class OTPModule {}
