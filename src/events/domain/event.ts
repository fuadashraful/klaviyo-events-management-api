import { ApiProperty } from '@nestjs/swagger';

export class Event {
  @ApiProperty({
    type: String,
    description: 'Unique identifier for the event',
    example: '653b4e9a2f4e8a001234abcd',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Purchased Item',
    description: 'Name of the event',
  })
  eventName: string;

  @ApiProperty({
    type: Object,
    example: { productName: 'Wireless Mouse', price: 29.99 },
    description: 'Key-value object containing event attributes',
  })
  eventAttributes: Record<string, any>;

  @ApiProperty({
    type: Object,
    example: { email: 'user@example.com', plan: 'Pro' },
    description: 'Key-value object containing profile attributes',
  })
  profileAttributes: Record<string, any>;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the event was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'Timestamp when the event was last updated',
    required: false,
  })
  updatedAt?: Date;
}
