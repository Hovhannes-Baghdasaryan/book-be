import {IsString, MaxLength} from 'class-validator'
import {ApiProperty} from '@nestjs/swagger'

export class LoginDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  username: string

  @ApiProperty()
  @IsString()
  @MaxLength(40)
  password: string
}
