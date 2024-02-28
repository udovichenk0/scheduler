import { Injectable } from "@nestjs/common";
import { sign, verify } from "jsonwebtoken";
import { UserDto } from "src/domain/user/dto/user.dto";
import { JWT_EXPIRED_ERROR, JWT_INVALID_ERROR } from "../constant/errors";
import { Errors } from "src/services/err/errors";
@Injectable()
export class RefreshService {
  signRefresh(userData: UserDto) {
    return sign(userData, process.env.JWT_SECRET as string, {
      expiresIn: "15d"
    });
  }
  verifyRefresh(token: string) {
    try {
      return verify(token, process.env.JWT_SECRET as string) as UserDto;
    } catch (err: any) {
      if (err.message == JWT_EXPIRED_ERROR) {
        return Errors.Unauthorized();
      }
      if (err.message == JWT_INVALID_ERROR) {
        return Errors.Unauthorized();
      }
      return Errors.InternalServerError();
    }
  }
}
