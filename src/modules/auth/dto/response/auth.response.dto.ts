import {AuthorEntity} from '@entities/typeorm'
import {ApiProperty} from '@nestjs/swagger'

export class AuthDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  username: string

  @ApiProperty()
  birthdate: Date

  @ApiProperty()
  biography: string

  @ApiProperty()
  token: string

  constructor(author: AuthorEntity, token?: string) {
    this.id = author.id
    this.username = author.username
    this.birthdate = author.birthdate
    this.biography = author.biography
    if (token) {
      this.token = token
    }
  }
}
