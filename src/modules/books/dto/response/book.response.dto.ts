import {AuthorEntity} from '@entities/typeorm'
import {BookEntity} from '@entities/typeorm/book.entity'

export class AuthorDTO {
  id: string
  username: string
  birthdate: Date
  biography: string
  books: BookEntity[]

  constructor(author: AuthorEntity) {
    this.id = author.id
    this.username = author.username
    this.birthdate = author.birthdate
    this.biography = author.biography
    this.books = author.books
  }
}
