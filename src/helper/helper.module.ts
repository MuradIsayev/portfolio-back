import { Module } from '@nestjs/common';
import { ErrorHandlerService } from './services/error-handler.service';

@Module({
  exports: [ErrorHandlerService],
  providers: [ErrorHandlerService],
})
export class HelperModule {}
