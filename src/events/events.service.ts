import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateBulkEventDto } from './dto/bulk-create-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { EventRepository } from './infrastructure/event-abstract.repository';
import { Event } from './domain/event';
import { KlaviyoService } from './services/klaviyo.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly klaviyoService: KlaviyoService,
  ) {}

  /**
   * Create a single event
   */
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    if (!createEventDto.eventName) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { eventName: 'Event name is required' },
      });
    }

    const existingEvent = await this.eventRepository.findByName(
      createEventDto.eventName,
    );

    if (existingEvent) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { eventName: 'Event with this name already exists' },
      });
    }

    this.klaviyoService.createEvent(createEventDto);

    return this.eventRepository.create({
      eventName: createEventDto.eventName,
      eventAttributes: createEventDto.eventAttributes,
      profileAttributes: createEventDto.profileAttributes,
      createdAt: new Date(),
    });
  }

  /**
   * Create multiple events in bulk
   */
  async createBulkEvents(events: CreateEventDto[]): Promise<Event[]> {
    if (!events || events.length === 0) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        errors: { events: 'Events array cannot be empty' },
      });
    }

    const createdEvents: Event[] = [];
    for (const evt of events) {
      if (!evt.eventName) {
        throw new BadRequestException({
          status: HttpStatus.BAD_REQUEST,
          errors: { eventName: 'Event name is required for all events' },
        });
      }

      const created = await this.eventRepository.create({
        eventName: evt.eventName,
        eventAttributes: evt.eventAttributes,
        profileAttributes: evt.profileAttributes,
        createdAt: new Date(),
      });

      createdEvents.push(created);
    }

    return createdEvents;
  }

  /**
   * Find an event by ID
   */
  async findById(id: Event['id']): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: { id: 'Event not found' },
      });
    }
    return event;
  }

  async findManyWithPagination(queryDto: QueryEventDto): Promise<Event[]> {
    return this.eventRepository.findManyWithPagination(queryDto);
  }

  /**
   * Optional: update an event
   */
  async update(
    id: Event['id'],
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Event> {
    const event = await this.findById(id);

    const updatedData = await this.eventRepository.update(id, {
      eventName: updateEventDto.eventName ?? event.eventName,
      eventAttributes: updateEventDto.eventAttributes ?? event.eventAttributes,
      profileAttributes:
        updateEventDto.profileAttributes ?? event.profileAttributes,
    });

    if (!updatedData) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return updatedData;
  }

  /**
   * Optional: remove an event
   */
  async remove(id: Event['id']): Promise<void> {
    const event = await this.findById(id);
    await this.eventRepository.remove(id);
  }

  /**
   * Count events grouped by metric (eventName) for a specific date
   * @param date YYYY-MM-DD format
   */
  async countEventsByMetricForDate(
    date: string,
  ): Promise<{ metricName: string; count: number }[]> {
    return this.eventRepository.countByMetricForDate(date);
  }

  async deleteEventsOlderThan7Days(): Promise<void> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    await this.eventRepository.deleteOlderThan(sevenDaysAgo);
  }

  async getProfileAttributesByEmail(
    email: string,
  ): Promise<Record<string, any>> {
    if (!email) {
      throw new NotFoundException('Email must be provided');
    }

    const entity =
      await this.eventRepository.findProfileAttributesByEmail(email);

    if (!entity) {
      throw new NotFoundException(`No profile found with email: ${email}`);
    }

    return entity.profileAttributes;
  }
}
