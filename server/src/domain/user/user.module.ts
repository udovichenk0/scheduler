import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepositoryModule } from "./infrastructure/repository/user.module";
import { UserRepository } from "./infrastructure/repository/user.repository";

@Module({
  imports: [UserRepositoryModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
