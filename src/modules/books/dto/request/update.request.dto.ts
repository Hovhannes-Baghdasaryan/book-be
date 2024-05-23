import {IsOptional, IsString, MaxLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateBookDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  title: string
}
