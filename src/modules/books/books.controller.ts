import {ApiTags} from '@nestjs/swagger'
import {AuthGuard} from '@guards/auth.guard'
import {BooksService} from './books.service'
import {PaginationDTO} from '@dto/paginationDTO'
import {SuccessDTO} from '@responses/successDTO'
import {BookDTO} from './dto/response/book.response.dto'
import {UpdateBookDTO} from './dto/request/update.request.dto'
import {PublishBookDTO} from './dto/request/publish.request.dto'
import {
  ApiAuthBearerDecorator,
  AuthContextDecorator,
  IAuthContext,
} from '@decorators/auth.decorator'
import {I_PaginatedSuccess, PaginatedSuccessDTO} from '@responses/paginated.dto'
import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common'
import {ApiPaginatedOutputDecorator} from '@decorators/output-paginated-openapi.decorator'
import {ApiOutputDecorator} from '@decorators/output-openapi.decorator'

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiPaginatedOutputDecorator(BookDTO)
  async publicBooks(@Query() paginatedDTO: PaginationDTO): Promise<I_PaginatedSuccess<BookDTO[]>> {
    const response = await this.booksService.getPublicBooks(paginatedDTO)
    return new PaginatedSuccessDTO(response)
  }

  @Post('publish')
  @ApiOutputDecorator(BookDTO)
  @ApiAuthBearerDecorator(AuthGuard)
  async publish(
    @Body() publishBookDTO: PublishBookDTO,
    @AuthContextDecorator() authContext: IAuthContext,
  ): Promise<SuccessDTO<BookDTO>> {
    const response = await this.booksService.publishBook(publishBookDTO, authContext)
    return new SuccessDTO({data: response})
  }

  @Patch('update/:id')
  @ApiOutputDecorator(BookDTO)
  @ApiAuthBearerDecorator(AuthGuard)
  async update(
    @Body() updateBookDTO: UpdateBookDTO,
    @AuthContextDecorator() authContext: IAuthContext,
    @Param('id') id: string,
  ): Promise<SuccessDTO<BookDTO>> {
    const response = await this.booksService.updateBook(id, updateBookDTO, authContext)
    return new SuccessDTO({data: response})
  }

  @Delete('delete/:id')
  @ApiOutputDecorator(BookDTO)
  @ApiAuthBearerDecorator(AuthGuard)
  async delete(
    @Param('id') id: string,
    @AuthContextDecorator() authContext: IAuthContext,
  ): Promise<SuccessDTO<BookDTO>> {
    const response = await this.booksService.deleteBook(id, authContext)
    return new SuccessDTO({data: response})
  }
}
