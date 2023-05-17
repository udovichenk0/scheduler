import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PrismaService } from 'src/database/prisma.service';
import { RefreshModule } from './refreshToken/refresh.module';

@Module({
  imports: [RefreshModule],
  providers: [TokenService],
  exports: [TokenService, RefreshModule],
})
export class TokenModule {}
