import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Between, LessThan } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { EventEntity } from '../entities/event.entity';
import { Event } from '../../../../domain/event';
import { EventRepository } from '../../../event-abstract.repository';
import { EventMapper } from '../mappers/event.mapper';
import { QueryEventDto } from 'src/events/dto/query-event.dto';

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

  async findByName(eventName: string): Promise<NullableType<Event>> {
    if (!eventName) return null;

    const entity = await this.eventsRepository.findOne({
      where: { eventName },
    });
    return entity ? EventMapper.toDomain(entity) : null;
  }

  async findManyWithPagination(queryDto: QueryEventDto): Promise<Event[]> {
    const { eventName, profileId, page = 1, limit = 10 } = queryDto;
    const skip = (page - 1) * limit;

    // Build TypeORM "where" conditions
    const where: any = {};
    if (eventName) {
      where.eventName = eventName; // exact match; for partial match, use Like
    }
    if (profileId) {
      where.profileId = profileId;
    }

    const [eventEntities] = await this.eventsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return eventEntities.map((eventEntity) => EventMapper.toDomain(eventEntity));
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

   async countByMetricForDate(date: string): Promise<{ metricName: string; count: number }[]> {
    if (!date) return [];

    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');

    // Fetch events within date range
    const events = await this.eventsRepository.find({
      where: {
        createdAt: Between(start, end),
      },
    });

    // Aggregate counts by eventName
    const countsMap = new Map<string, number>();
    events.forEach(event => {
      const key = event.eventName;
      countsMap.set(key, (countsMap.get(key) ?? 0) + 1);
    });

    return Array.from(countsMap.entries()).map(([metricName, count]) => ({
      metricName,
      count,
    }));
  }

  async deleteOlderThan(date: Date): Promise<void> {
    await this.eventsRepository.delete({
      createdAt: LessThan(date),
    });
  }

    /**
   * Find profile attributes by email
   */
  async findProfileAttributesByEmail(email: string): Promise<Record<string, any> | null> {
    // TODO: Fix query to return valid data
    if (!email) return null;
    const result = await this.eventsRepository.query(
        `SELECT profileAttributes 
        FROM events 
        WHERE JSON_UNQUOTE(JSON_EXTRACT(profileAttributes, '$.email')) = ? 
        LIMIT 1`,
        [email],
      );

      if (!result || result.length === 0) {
        return null;
      }

      // If profileAttributes is JSON column, TypeORM returns it as object
      // If stored as string, parse it
      const profileAttributes = typeof result[0].profileAttributes === 'string'
        ? JSON.parse(result[0].profileAttributes)
        : result[0].profileAttributes;

      return profileAttributes;
  }

}
