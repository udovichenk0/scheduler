import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { UserService } from './domain/user/user.service';

async function bootstrap() {
  try {
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
    UserService.userCollector()
    await app.listen(3000);
  } catch (error) {

  }
}
bootstrap();
