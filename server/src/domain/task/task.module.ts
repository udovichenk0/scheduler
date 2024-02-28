import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { TokenGuard } from "../token/guards/token-guard";
import { JWTModule } from "../token/jwtToken/jwt.module";
import { TaskRepositoryModule } from "./repository/tark.module";

@Module({
  imports: [JWTModule, TaskRepositoryModule],
  providers: [TaskService, TokenGuard],
  controllers: [TaskController]
})
export class TaskModule {}
