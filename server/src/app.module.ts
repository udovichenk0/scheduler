import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { TokenModule } from './domain/token/token.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './domain/task/task.module';
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
  ],
  providers: [PrismaService],
})
export class AppModule {}
