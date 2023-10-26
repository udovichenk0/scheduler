import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { job } from 'cron';
import { PrismaClient } from '@prisma/client';
const prismaClient = new PrismaClient();
job(
  '0 */24 * * *',
  async function () {
    await prismaClient.user.deleteMany({
      where: {
        AND: [
          { verified: false },
          {
            created_at: {
              lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
    });
  },
  null,
  true,
);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: 'https://scheduler-client-nine.vercel.app',
    credentials: true,
  });
  app.use(
    session({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
