import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: configService.get('CLIENT_URL'),
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
