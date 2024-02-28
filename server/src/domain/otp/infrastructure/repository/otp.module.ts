import { Module } from "@nestjs/common";
import { PrismaService } from "src/services/clients/prisma";
import { OTPRepository } from "./otp.repository";

@Module({
  providers: [PrismaService, OTPRepository],
  exports: [OTPRepository, PrismaService]
})
export class OTPRepositoryModule {}
