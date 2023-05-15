import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [UserModule],
  providers: [PrismaService],
})
export class AppModule {}
