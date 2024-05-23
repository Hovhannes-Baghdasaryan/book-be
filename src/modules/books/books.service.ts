import {Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common'
import {BookRepository} from '@repositories/typeorm'
import {BOOK_NOT_FOUND} from '@errors/book.errors'
import * as activityLogs from '@enums/active-logs'
import {handleError} from '@helpers/error.helper'
import {LogError} from '@helpers/logger.helper'
import {IAuthContext} from '@decorators/auth.decorator'
import {BookDTO} from './dto/response/book.response.dto'
import {UpdateBookDTO} from './dto/request/update.request.dto'
import {PublishBookDTO} from './dto/request/publish.request.dto'
import {I_PaginatedSuccess} from '@responses/paginated.dto'
import {PaginationDto} from '@dto/pagination.dto'
import {EntityValidator} from '@validators/entity.validator'
import {BookEntity} from '@entities/typeorm'

@Injectable()
export class BooksService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly entityValidator: EntityValidator,
  ) {}

  async getPublicBooks(paginatedDto: PaginationDto): Promise<I_PaginatedSuccess<BookDTO[]>> {
    try {
      const {data, totalItems} = await this.bookRepository.findAllPaginated(
        paginatedDto.page,
        paginatedDto.perPage,
        {
          relations: {
            author: true,
          },
          order: {
            createdAt: paginatedDto.sort,
          },
        },
      )

      return {
        totalItems,
        items: data.map((book) => new BookDTO(book)),
        page: paginatedDto.page,
        perPage: paginatedDto.perPage,
      }
    } catch (error) {
      LogError(activityLogs.BookLogsFunctions.GetPublicBooks, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('BOOK_PUBLISH_INTERNAL')
    }
  }

  async publishBook(publishBookDTO: PublishBookDTO, authContext: IAuthContext): Promise<BookDTO> {
    try {
      await this.entityValidator.Duplicate({
        entity: BookEntity,
        entityColumn: 'isbn',
        fieldValue: publishBookDTO.isbn,
        exceptionMessage: 'Duplicate Book Number',
      })

      const publishedBook = await this.bookRepository.createBook(publishBookDTO, authContext.id)

      return new BookDTO(publishedBook)
    } catch (error) {
      LogError(activityLogs.BookLogsFunctions.PublishBook, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('BOOK_PUBLISH_INTERNAL')
    }
  }

  async updateBook(
    bookId: string,
    publishBookDTO: UpdateBookDTO,
    authContext: IAuthContext,
  ): Promise<BookDTO> {
    try {
      // I check authorId as well to ensure only the book owner can mutate the book
      const book = await this.bookRepository.findOneBy({id: bookId, authorId: authContext.id})
      if (!book) {
        LogError(activityLogs.BookLogsFunctions.UpdateBook, activityLogs.LogsActions.Failed, {
          message: BOOK_NOT_FOUND,
        })
        throw new NotFoundException(BOOK_NOT_FOUND)
      }

      await this.bookRepository.updateBook(book.id, publishBookDTO)

      const updatedBook = await this.bookRepository.findOneBy({id: book.id})

      return new BookDTO(updatedBook)
    } catch (error) {
      LogError(activityLogs.BookLogsFunctions.UpdateBook, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('BOOK_UPDATE_INTERNAL')
    }
  }

  async deleteBook(bookId: string, authContext: IAuthContext): Promise<BookDTO> {
    try {
      // I check authorId as well to ensure only the book owner can mutate the book
      const book = await this.bookRepository.findOneBy({id: bookId, authorId: authContext.id})
      if (!book) {
        LogError(activityLogs.BookLogsFunctions.DeleteBook, activityLogs.LogsActions.Failed, {
          message: BOOK_NOT_FOUND,
        })
        throw new NotFoundException(BOOK_NOT_FOUND)
      }

      await this.bookRepository.deleteBook(book.id)

      return new BookDTO(book)
    } catch (error) {
      LogError(activityLogs.BookLogsFunctions.DeleteBook, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('BOOK_UPDATE_INTERNAL')
    }
  }
}
