import {ApiProperty} from '@nestjs/swagger'
import {BookEntity} from '@entities/typeorm/book.entity'
import {AuthorDTO} from '@modules/authors/dto/response/profile.response.dto'

export class BookDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  isbn: string

  @ApiProperty()
  publishedAt: Date

  constructor(book: BookEntity) {
    this.id = book.id
    this.title = book.title
    this.isbn = book.isbn
    this.publishedAt = book.published_at
  }
}

export class BookAuthorDTO extends BookDTO {
  @ApiProperty()
  author: AuthorDTO

  constructor(book: BookEntity) {
    super(book)
    this.author = new AuthorDTO(book.author)
  }
}
