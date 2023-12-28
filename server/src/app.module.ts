import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { TokenModule } from './domain/token/token.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './domain/task/task.module';
import { EmailConfirmationModule } from './domain/email-confirmation/confirmation.module';
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
    EmailConfirmationModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
