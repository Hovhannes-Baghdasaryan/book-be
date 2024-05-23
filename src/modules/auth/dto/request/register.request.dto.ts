import {IsDate, IsOptional, IsString, MaxLength} from 'class-validator'
import {Type} from 'class-transformer'
import {ApiProperty} from '@nestjs/swagger'

export class RegisterDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  username: string

  @ApiProperty()
  @IsString()
  @MaxLength(40)
  password: string

  @ApiProperty()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthdate?: Date

  @ApiProperty()
  @IsOptional()
  @IsString()
  biography?: string
}
