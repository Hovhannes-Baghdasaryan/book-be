import {Injectable, InternalServerErrorException} from '@nestjs/common'
import {LogError} from '@helpers/logger.helper'
import {AuthorEntity} from '@entities/typeorm'
import {handleError} from '@helpers/error.helper'
import * as activityLogs from '@enums/active-logs'
import {IAuthContext} from '@decorators/auth.decorator'
import {AuthorRepository, BookRepository} from '@repositories/typeorm'
import {EntityValidator} from '@validators/entity.validator'
import {AuthorDTO} from './dto/response/profile.response.dto'
import {UpdateAuthorDTO} from './dto/request/update-profile.request.dto'
import {BookAuthorDTO, BookDTO} from '../books/dto/response/book.response.dto'
import {PaginationDTO} from '@dto/paginationDTO'
import {I_PaginatedSuccess} from '@responses/paginated.dto'
import {I_Success, SuccessDTO} from '@responses/successDTO'

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly entityValidator: EntityValidator,
    private readonly bookRepository: BookRepository,
  ) {}

  async deleteAuthor(authContext: IAuthContext): Promise<I_Success> {
    try {
      await this.authorRepository.deleteAuthor(authContext)

      return new SuccessDTO({
        message: 'Author Removed Successfully',
      })
    } catch (error) {
      LogError(activityLogs.AuthorLogsFunctions.DeleteProfile, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('AUTHOR_DELETE_INTERNAL')
    }
  }

  async getAuthorBooks(
    paginatedDto: PaginationDTO,
    authContext: IAuthContext,
  ): Promise<I_PaginatedSuccess<BookDTO[]>> {
    try {
      const {data, totalItems} = await this.bookRepository.findAllPaginated(
        paginatedDto.page,
        paginatedDto.perPage,
        {
          where: {
            authorId: authContext.id,
          },
          order: {
            createdAt: paginatedDto.sort,
          },
        },
      )

      return {
        items: data.map((book) => new BookDTO(book)),
        totalItems,
        page: paginatedDto.page,
        perPage: paginatedDto.perPage,
      }
    } catch (error) {
      LogError(activityLogs.BookLogsFunctions.PublishBook, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('BOOK_PUBLISH_INTERNAL')
    }
  }

  async getProfile(authContext: IAuthContext): Promise<AuthorDTO> {
    try {
      const author = await this.authorRepository.findOne({
        where: {id: authContext.id},
      })

      return new AuthorDTO(author)
    } catch (error) {
      LogError(activityLogs.AuthorLogsFunctions.GetProfile, activityLogs.LogsActions.Failed, {
        message: error,
      })
      handleError(error)
      throw new InternalServerErrorException('AUTHOR_PROFILE_INTERNAL')
    }
  }

  async updateAuthor(authContext: IAuthContext, updateAuthor: UpdateAuthorDTO): Promise<AuthorDTO> {
    try {
      await this.entityValidator.Duplicate({
        entity: AuthorEntity,
        entityColumn: 'username',
        fieldValue: updateAuthor.username,
      })

      await this.authorRepository.update(authContext.id, updateAuthor)

      const author = await this.authorRepository.findOne({
        where: {id: authContext.id},
        relations: {books: true},
      })

      return new AuthorDTO(author)
    } catch (error) {
      LogError(activityLogs.AuthorLogsFunctions.UpdateProfile, activityLogs.LogsActions.Failed, {
        message: error,
      })
      handleError(error)
      throw new InternalServerErrorException('AUTHOR_UPDATE_INTERNAL')
    }
  }
}
