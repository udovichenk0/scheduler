import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';

@Module({
  providers: [RefreshService],
  exports: [RefreshService]
})
export class RefreshModule {}
