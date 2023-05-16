import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserDto } from 'src/domain/user/dto/user.dto';
@Injectable()
export class RefreshService {
  create(payload: UserDto) {
    const token = sign(payload, process.env.PRIVATE_KEY, { expiresIn: '1h' });
    return token;
  }
}
