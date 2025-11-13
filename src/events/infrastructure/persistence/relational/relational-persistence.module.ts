import { Module } from '@nestjs/common';
import { EventRepository } from '../../event-abstract.repository';
import { EventRelationalRepository } from './repositories/event.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity])],
  providers: [
    {
      provide: EventRepository,
      useClass: EventRelationalRepository,
    },
  ],
  exports: [EventRepository],
})
export class RelationalEventPersistenceModule {}
