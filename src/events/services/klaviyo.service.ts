import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import axios from 'axios';

@Injectable()
export class KlaviyoService {
  private readonly klaviyoUrl = 'https://a.klaviyo.com/api/events';
  private readonly klaviyoApiKey = process.env.KLAVIYO_API_KEY ?? 'your-private-api-key'; // Ideally: process.env.KLAVIYO_API_KEY

  async createEvent(dto: CreateEventDto): Promise<any> {
    const payload = this.buildKlaviyoPayload(dto);

    try {
      const response = await axios.post(this.klaviyoUrl, payload, {
        headers: {
          accept: 'application/vnd.api+json',
          revision: '2025-10-15',
          'content-type': 'application/vnd.api+json',
          Authorization: `Klaviyo-API-Key ${this.klaviyoApiKey}`,
        },
      });

      console.log(`Created data: ${response.status}`);

      return response.data;
    } catch (error) {
      console.error('Error creating Klaviyo event:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data || 'Failed to create event',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildKlaviyoPayload(dto: CreateEventDto): any {
    return {
      data: {
        type: 'event',
        attributes: {
          properties: dto.eventAttributes || {},
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: dto.eventName,
                service: dto.eventAttributes?.service ?? 'default-service',
              },
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: dto.profileAttributes,
              id: dto.profileAttributes?.external_id ?? 'unknown',
            },
          },
          time: dto.eventAttributes?.time ?? new Date().toISOString(),
          value: dto.eventAttributes?.value ?? 9.99,
          value_currency: dto.eventAttributes?.value_currency ?? 'USD',
          unique_id:
            dto.eventAttributes?.unique_id ??
            `${dto.eventName}-${Date.now()}`,
        },
      },
    };
  }
}
