import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { TokenModule } from './domain/token/token.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, TokenModule],
  providers: [PrismaService],
})
export class AppModule {}
