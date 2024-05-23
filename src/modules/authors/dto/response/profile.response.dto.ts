import {AuthorEntity} from '@entities/typeorm'

export class AuthDto {
  id: string
  username: string
  birthdate: Date
  biography: string
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
