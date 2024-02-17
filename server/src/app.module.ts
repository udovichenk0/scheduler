import { Module } from '@nestjs/common';
import { PrismaService } from './services/clients/prisma/prisma.client';
import { TokenModule } from './domain/token/token.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './domain/task/task.module';
import { OTPModule } from './domain/otp/otp.module.';
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${ENV}`],
    }),
    UserModule,
    AuthModule,
    TokenModule,
    TaskModule,
    OTPModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
