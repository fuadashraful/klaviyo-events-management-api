import { Event } from '../../../../domain/event';
import { EventEntity } from '../entities/event.entity';

export class EventMapper {
  // Accept Partial<Event> to allow missing fields for update/create
  static toPersistence(domainEntity: Partial<Event>): EventEntity {
    const persistenceEntity = new EventEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name ?? '';
    persistenceEntity.eventAttributes = domainEntity.eventAttributes ?? {};
    persistenceEntity.profileAttributes = domainEntity.profileAttributes ?? {};
    persistenceEntity.createdAt = domainEntity.createdAt ?? new Date();
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? new Date();

    return persistenceEntity;
  }

  static toDomain(raw: EventEntity): Event {
    const domainEntity = new Event();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.eventAttributes = raw.eventAttributes;
    domainEntity.profileAttributes = raw.profileAttributes;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }
}
