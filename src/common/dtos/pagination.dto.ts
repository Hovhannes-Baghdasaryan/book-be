import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { SortOrder } from '@enums/sort-order.enum';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    name: 'page',
    required: false,
    type: Number,
    description: 'From Which Page To Start',
  })
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    name: 'perPage',
    required: false,
    description: 'Each Page Length',
    type: Number,
  })
  perPage = 10;

  @IsOptional()
  @IsEnum(SortOrder)
  @ApiPropertyOptional({
    name: 'sortOrder',
    enum: SortOrder,
    required: false,
    description: 'Sort Order Ascending or Descending',
  })
  sortOrder: SortOrder = SortOrder.DESC;
}
