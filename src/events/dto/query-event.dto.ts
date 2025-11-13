import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class QueryEventDto {
  @ApiPropertyOptional({
    description: 'Search events by name (partial, case-insensitive)',
  })
  @IsOptional()
  @IsString()
  eventName?: string;

  @ApiPropertyOptional({
    description: 'Filter events by profile ID',
  })
  @IsOptional()
  @IsString()
  profileId?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of results per page (max: 100)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
