import {ApiProperty} from '@nestjs/swagger'
import {AuthorEntity} from '@entities/typeorm'

export class AuthorDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  username: string

  @ApiProperty()
  birthdate: Date

  @ApiProperty()
  biography: string

  constructor(author: AuthorEntity | null) {
    this.id = author?.id || null
    this.username = author?.username || 'Deleted Account'
    this.birthdate = author?.birthdate || null
    this.biography = author?.biography || null
  }
}
