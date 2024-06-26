import {Body, Controller, Delete, Get, Patch, Query} from '@nestjs/common'
import {ApiTags} from '@nestjs/swagger'
import {AuthGuard} from '@guards/auth.guard'
import {AuthorsService} from './authors.service'
import {PaginationDTO} from '@dto/paginationDTO'
import {I_Success, SuccessDTO} from '@responses/successDTO'
import {AuthorDTO} from './dto/response/profile.response.dto'
import {BookDTO} from '../books/dto/response/book.response.dto'
import {UpdateAuthorDTO} from './dto/request/update-profile.request.dto'
import {
  IAuthContext,
  AuthContextDecorator,
  ApiAuthBearerDecorator,
} from '@decorators/auth.decorator'
import {ApiOutputDecorator} from '@decorators/output-openapi.decorator'
import {I_PaginatedSuccess, PaginatedSuccessDTO} from '@responses/paginated.dto'
import {ApiPaginatedOutputDecorator} from '@decorators/output-paginated-openapi.decorator'

@ApiTags('Author')
@Controller('author')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get('books')
  @ApiAuthBearerDecorator(AuthGuard)
  @ApiPaginatedOutputDecorator(BookDTO)
  async authorBooks(
    @Query() paginatedDTO: PaginationDTO,
    @AuthContextDecorator() authContext: IAuthContext,
  ): Promise<I_PaginatedSuccess<BookDTO[]>> {
    const response = await this.authorsService.getAuthorBooks(paginatedDTO, authContext)
    return new PaginatedSuccessDTO(response)
  }

  @Get('profile')
  @ApiAuthBearerDecorator(AuthGuard)
  @ApiOutputDecorator(AuthorDTO)
  async getProfile(
    @AuthContextDecorator() authContext: IAuthContext,
  ): Promise<I_Success<AuthorDTO>> {
    const response = await this.authorsService.getProfile(authContext)
    return new SuccessDTO({data: response})
  }

  @Patch('update')
  @ApiOutputDecorator(AuthorDTO)
  @ApiAuthBearerDecorator(AuthGuard)
  async updateAuthor(
    @AuthContextDecorator() authContext: IAuthContext,
    @Body() updateAuthorDTO: UpdateAuthorDTO,
  ): Promise<I_Success<AuthorDTO>> {
    const response = await this.authorsService.updateAuthor(authContext, updateAuthorDTO)
    return new SuccessDTO({data: response})
  }

  @Delete('remove')
  @ApiAuthBearerDecorator(AuthGuard)
  @ApiPaginatedOutputDecorator(BookDTO)
  async deleteAuthor(@AuthContextDecorator() authContext: IAuthContext): Promise<I_Success> {
    const response = await this.authorsService.deleteAuthor(authContext)
    return new SuccessDTO(response)
  }
}
