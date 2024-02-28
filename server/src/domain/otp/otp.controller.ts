import { Body, Controller, Post, UsePipes } from "@nestjs/common";
import { OTPService } from "./otp.service";
import { ResendCodeDto } from "./dto/dto";
import { handleError, isError } from "src/services/err/errors";

@Controller("otp")
export class OTPController {
  constructor(private otpService: OTPService) {}
  //otp/resend
  @Post("resend")
  @UsePipes(ResendCodeDto)
  async resend(@Body() data: ResendCodeDto) {
    const result = await this.otpService.resendOTP(data.email);
    if (isError(result)) {
      return handleError(result);
    }
    return {
      message: "Confirmation code was sent."
    };
  }
}
