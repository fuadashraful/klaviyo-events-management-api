import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EventsService } from '../events.service';

@Injectable()
export class CleanupService {
  constructor(private readonly eventsService: EventsService) {}

  // Runs every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.eventsService.deleteEventsOlderThan7Days();
    console.log('Deleted events older than 7 days');
  }
}
