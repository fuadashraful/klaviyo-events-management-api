import { IsString, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsString()
  eventName: string;

  @IsObject()
  eventAttributes: Record<string, any>;

  @IsObject()
  profileAttributes: Record<string, any>;
}
