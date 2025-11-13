import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { EventEntity } from '../entities/event.entity';
import { Event } from '../../../../domain/event';
import { EventRepository } from '../../../event-abstract.repository';
import { EventMapper } from '../mappers/event.mapper';

@Injectable()
export class EventRelationalRepository implements EventRepository {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
  ) {}

  async create(data: Partial<Event>): Promise<Event> {
    const persistenceModel = EventMapper.toPersistence(data);
    const newEntity = await this.eventsRepository.save(
      this.eventsRepository.create(persistenceModel),
    );
    return EventMapper.toDomain(newEntity);
  }

  async findByName(name: string): Promise<NullableType<Event>> {
    if (!name) return null;

    const entity = await this.eventsRepository.findOne({
      where: { name },
    });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findMany(query?: any): Promise<Event[]> {
    const entities = await this.eventsRepository.find(query);
    return entities.map((entity) => EventMapper.toDomain(entity));
  }

  async findById(id: Event['id']): Promise<NullableType<Event>> {
    const entity = await this.eventsRepository.findOne({
      where: { id },
    });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async update(id: Event['id'], payload: Partial<Event>): Promise<Event | null> {
    const entity = await this.eventsRepository.findOne({ where: { id } });
    if (!entity) return null;

    const updatedEntity = await this.eventsRepository.save(
      this.eventsRepository.create(EventMapper.toPersistence({
        ...EventMapper.toDomain(entity),
        ...payload,
      })),
    );
    return EventMapper.toDomain(updatedEntity);
  }

  async remove(id: Event['id']): Promise<void> {
    await this.eventsRepository.softDelete(id);
  }
}
