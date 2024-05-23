import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {BaseRepository} from 'common/repositories'
import {BookEntity} from '@entities/typeorm/book.entity'
import {PublishBookDTO} from 'modules/books/dto/request/publish.request.dto'
import {UpdateBookDTO} from 'modules/books/dto/request/update.request.dto'

@Injectable()
export class BookRepository extends BaseRepository<BookEntity> {
  @InjectRepository(BookEntity) bookRepository: Repository<BookEntity>

  constructor(public dataSource: DataSource) {
    super(BookEntity, dataSource.createEntityManager())
  }

  createBook(publishBookDTO: PublishBookDTO, authorId: string): Promise<BookEntity> {
    return this.save({
      title: publishBookDTO.title,
      isbn: publishBookDTO.isbn,
      authorId: authorId,
    })
  }

  async updateBook(id: string, updateBookDTO: UpdateBookDTO): Promise<void> {
    await this.update(
      {
        id,
      },
      {
        title: updateBookDTO.title,
      },
    )
  }

  async deleteBook(id: string): Promise<void> {
    await this.delete({
      id,
    })
  }

  findAllBooks(page: number, pageSize: number): Promise<BookEntity[]> {
    return this.bookRepository.find({
      take: pageSize,
      skip: pageSize * (page - 1),
    })
  }

  findByBookNumber(isbn: string): Promise<BookEntity> {
    return this.findOneBy({isbn})
  }
}
