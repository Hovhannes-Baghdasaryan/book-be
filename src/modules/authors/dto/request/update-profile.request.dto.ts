import {IsDate, IsOptional, IsString, MaxLength} from 'class-validator'
import {Type} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'

export class UpdateAuthorDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  username: string

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthdate: Date

  @ApiProperty()
  @IsOptional()
  @IsString()
  biography: string
}
