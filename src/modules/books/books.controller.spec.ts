import {Test, TestingModule} from '@nestjs/testing'
import {BooksController} from './books.controller'
import {BooksService} from './books.service'
import {AuthGuard} from '@guards/auth.guard'
import {PaginationDTO} from '@dto/paginationDTO'
import {BookAuthorDTO, BookDTO} from './dto/response/book.response.dto'
import {PublishBookDTO} from './dto/request/publish.request.dto'
import {UpdateBookDTO} from './dto/request/update.request.dto'
import {IAuthContext} from '@decorators/auth.decorator'
import {I_PaginatedSuccess, PaginatedSuccessDTO} from '@responses/paginated.dto'
import {SuccessDTO} from '@responses/successDTO'
import {ExecutionContext} from '@nestjs/common'
import {Reflector} from '@nestjs/core'
import {SortOrder} from '@enums/sort-order.enum'

describe('BooksController', () => {
  let controller: BooksController
  let service: BooksService

  const mockBooksService = {
    getPublicBooks: jest.fn(),
    publishBook: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  }

  const authContext = {id: '1', username: 'test'} as IAuthContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        Reflector,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest()
          request.authContext = authContext // Injecting authContext for testing
          return true
        }),
      })
      .compile()

    controller = module.get<BooksController>(BooksController)
    service = module.get<BooksService>(BooksService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('publicBooks', () => {
    it('should return paginated public books', async () => {
      const paginatedDTO: PaginationDTO = {page: 1, perPage: 10, sort: SortOrder.ASC}
      const result: I_PaginatedSuccess<BookAuthorDTO[]> = new PaginatedSuccessDTO({
        items: [],
        totalItems: 0,
        perPage: 10,
        page: 1,
      })

      jest.spyOn(service, 'getPublicBooks').mockResolvedValue(result)

      expect(await controller.publicBooks(paginatedDTO)).toEqual(result)
      expect(service.getPublicBooks).toHaveBeenCalledWith(paginatedDTO)
    })

    it('should throw an error if fetching books fails', async () => {
      jest.spyOn(service, 'getPublicBooks').mockRejectedValue(new Error('Fetching failed'))

      await expect(
        controller.publicBooks({page: 1, perPage: 10, sort: SortOrder.ASC}),
      ).rejects.toThrow()
    })
  })

  describe('publish', () => {
    it('should publish a new book', async () => {
      const publishBookDTO: PublishBookDTO = {title: 'New Book', isbn: '1234567890'}
      const result = {title: 'New Book', isbn: '1234567890'} as BookDTO

      jest.spyOn(service, 'publishBook').mockResolvedValue(result)

      expect(await controller.publish(publishBookDTO, authContext)).toEqual(
        new SuccessDTO({data: result}),
      )
      expect(service.publishBook).toHaveBeenCalledWith(publishBookDTO, authContext)
    })

    it('should throw an error if publishing fails', async () => {
      jest.spyOn(service, 'publishBook').mockRejectedValue(new Error('Publishing failed'))

      await expect(
        controller.publish({title: 'New Book', isbn: '1234567890'}, authContext),
      ).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDTO: UpdateBookDTO = {title: 'Updated Book'}
      const result = {title: updateBookDTO.title} as BookDTO

      jest.spyOn(service, 'updateBook').mockResolvedValue(result)

      expect(await controller.update(updateBookDTO, authContext, '1')).toEqual(
        new SuccessDTO({data: result}),
      )
      expect(service.updateBook).toHaveBeenCalledWith('1', updateBookDTO, authContext)
    })

    it('should throw an error if updating fails', async () => {
      jest.spyOn(service, 'updateBook').mockRejectedValue(new Error('Updating failed'))

      await expect(controller.update({title: 'Updated Book'}, authContext, '1')).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should delete a book', async () => {
      const result = {} as BookDTO

      jest.spyOn(service, 'deleteBook').mockResolvedValue(result)

      expect(await controller.delete('1', authContext)).toEqual(new SuccessDTO({data: result}))
      expect(service.deleteBook).toHaveBeenCalledWith('1', authContext)
    })

    it('should throw an error if deleting fails', async () => {
      jest.spyOn(service, 'deleteBook').mockRejectedValue(new Error('Deleting failed'))

      await expect(controller.delete('1', authContext)).rejects.toThrow()
    })
  })
})
