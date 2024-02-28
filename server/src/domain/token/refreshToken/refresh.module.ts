import { Module } from "@nestjs/common";
import { RefreshService } from "./refresh.service";
import { PrismaService } from "src/services/clients/prisma/prisma.client";

@Module({
  providers: [RefreshService],
  exports: [RefreshService]
})
export class RefreshModule {}
