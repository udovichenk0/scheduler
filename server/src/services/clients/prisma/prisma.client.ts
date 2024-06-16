import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated";
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log("CONNECTED");
      })
      .catch((e) => {
        console.log("Error happened", e);
      });
  }
}
