import {IsDate, IsOptional, IsString, MaxLength} from 'class-validator'
import {Type} from 'class-transformer'

export class UpdateAuthorDTO {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  username: string

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthdate: Date

  @IsOptional()
  @IsString()
  biography: string
}
