import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as session from "express-session";
import { ConfigService } from "@nestjs/config";
import { UserService } from "./domain/user/user.service";

import RedisStore from "connect-redis";
import { Redis } from "ioredis";

async function bootstrap() {
  try {
    const redis = new Redis({
      port: 6379,
      host: "my-redis"
    });
    redis.ping((err, result) => {
      if (err) {
        console.log(err);
        redis.quit();
        return;
      }
      console.log(result);
    });
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const redisStore = new RedisStore({
      client: redis,
      prefix: "myapp:"
    });
    app.enableCors({
      origin: configService.get("CLIENT_URL"),
      credentials: true
    });
    app.use(
      session({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        secret: configService.get("SESSION_SECRET"),
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true
        }
      })
    );
    await app.listen(3000);
    UserService.userCollector();
  } catch (error) {}
}
bootstrap();
