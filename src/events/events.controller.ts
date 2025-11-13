import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateBulkEventDto } from './dto/bulk-create-event.dto';
import { QueryEventDto } from './dto/query-event.dto';
import { Event } from './domain/event';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiTags('Events')
@Controller('v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * GET /events
   * Get all events with pagination, search, and filtering
   */
  @ApiOkResponse({ type: InfinityPaginationResponse(Event) })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryEventDto,
  ): Promise<InfinityPaginationResponseDto<Event>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) limit = 50;

    const events = await this.eventsService.findManyWithPagination(query);
    return infinityPagination(events, { page, limit });
  }

  /**
   * POST /events
   * Create a single event
   */
  @Post()
  @ApiCreatedResponse({
    type: Event,
    description: 'Event created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid event payload' })
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    if (!createEventDto.eventName) {
      throw new BadRequestException('Event name is required');
    }

    const createdEvent = await this.eventsService.createEvent(createEventDto);
    return createdEvent;
  }

  /**
   * POST /events/bulk
   * Create multiple events in bulk
   */
  @Post('bulk')
  @ApiCreatedResponse({
    type: [Event],
    description: 'Bulk events created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid bulk events payload' })
  async createBulk(
    @Body() createBulkEventDto: CreateBulkEventDto,
  ): Promise<Event[]> {
    if (!createBulkEventDto.events || createBulkEventDto.events.length === 0) {
      throw new BadRequestException('Events array cannot be empty');
    }

    const createdEvents = await this.eventsService.createBulkEvents(
      createBulkEventDto.events,
    );
    return createdEvents;
  }

  @Get('count-by-metric')
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiResponse({
    status: 200,
    description: 'Event counts by metric for the given date',
  })
  async getCountByMetric(
    @Query('date') date: string,
  ): Promise<{ metricName: string; count: number }[]> {
    return this.eventsService.countEventsByMetricForDate(date);
  }

  @Get('profile-attributes')
  @ApiQuery({ name: 'email', required: true, example: 'user@example.com' })
  async getProfileAttributes(@Query('email') email: string) {
    return this.eventsService.getProfileAttributesByEmail(email);
  }
}
