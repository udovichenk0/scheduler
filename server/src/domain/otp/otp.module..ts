import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { OTPRepository } from './infrastructure/repository/otp.repository';
import { UserModule } from '../user/user.module';
import { OTPRepositoryModule } from './infrastructure/repository/otp.module';
import { EmailTransporter } from 'src/services/nodemailer/client';

@Module({
  imports: [UserModule, OTPRepositoryModule],
  providers: [OTPService, OTPRepository, EmailTransporter],
  controllers: [OTPController],
  exports: [OTPService]
})
export class OTPModule {}
