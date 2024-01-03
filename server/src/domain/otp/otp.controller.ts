import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { OTPService } from './otp.service';
import { ResendCodeDto } from './dto/dto';

@Controller('otp')
export class OTPController {
  constructor(private otpService: OTPService) {}
  //otp/resend
  @Post('resend')
  @UsePipes(ResendCodeDto)
  async resend(@Body() data: ResendCodeDto) {
    await this.otpService.resendOTP(data.email);
    return {
      message: 'Confirmation code was sent.',
    };
  }
}
