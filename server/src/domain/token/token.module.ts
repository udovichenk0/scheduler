import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { RefreshModule } from './refreshToken/refresh.module';
import { JWTModule } from './jwtToken/jwt.module';
import { TokenController } from './token.controller';

@Module({
  imports: [RefreshModule, JWTModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService, RefreshModule, JWTModule],
})
export class TokenModule {}

