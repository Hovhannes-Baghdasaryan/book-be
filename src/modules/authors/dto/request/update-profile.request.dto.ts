import {IsDate, IsNotEmpty, IsString, MaxLength} from 'class-validator'
import {Type} from 'class-transformer'

export class RegisterDTO {
  @IsString()
  @MaxLength(20)
  username: string

  @IsString()
  @MaxLength(40)
  password: string

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthdate: Date

  @IsString()
  biography: string
}

export class LoginDTO {
  @IsString()
  @MaxLength(20)
  username: string

  @IsString()
  @MaxLength(40)
  password: string
}
