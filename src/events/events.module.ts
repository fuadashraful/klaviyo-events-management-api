import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { RelationalEventPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { KlaviyoService } from './services/klaviyo.service';

@Module({
  imports: [
    // import modules, etc.
    RelationalEventPersistenceModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, KlaviyoService],
  exports: [EventsService, RelationalEventPersistenceModule],
})
export class EventModule {}
