import {IsString, MaxLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class PublishBookDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  title: string

  @ApiProperty()
  @IsString()
  @MaxLength(20)
  isbn: string
}
