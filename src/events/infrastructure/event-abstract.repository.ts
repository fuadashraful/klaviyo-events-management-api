import { NullableType } from 'src/utils/types/nullable.type';
import { Event } from 'src/events/domain/event';

export abstract class EventRepository {
  abstract create(data: Partial<Event>): Promise<Event>;

  abstract findByName(name: string): Promise<NullableType<Event>>;

  abstract findMany(query?: any): Promise<Event[]>;

  abstract findById(id: Event['id']): Promise<NullableType<Event>>;

  abstract update(id: Event['id'], payload: Partial<Event>): Promise<Event | null>;

  abstract remove(id: Event['id']): Promise<void>;
}
