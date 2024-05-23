import {Test, TestingModule} from '@nestjs/testing'
import {BooksService} from './books.service'
import {BookRepository} from '@repositories/typeorm'
import {EntityValidator} from '@validators/entity.validator'
import {InternalServerErrorException, NotFoundException} from '@nestjs/common'
import {BookDTO} from './dto/response/book.response.dto'
import {PublishBookDTO} from './dto/request/publish.request.dto'
import {UpdateBookDTO} from './dto/request/update.request.dto'
import {PaginationDTO} from '@dto/paginationDTO'
import {IAuthContext} from '@decorators/auth.decorator'
import {I_PaginatedSuccess} from '@responses/paginated.dto'
import {SortOrder} from '@enums/sort-order.enum'
import {BookEntity} from '@entities/typeorm'

describe('BooksService', () => {
  let service: BooksService

  const mockBookRepository = {
    findAllPaginated: jest.fn(),
    createBook: jest.fn(),
    findOneBy: jest.fn(),
    updateBook: jest.fn(),
    deleteBook: jest.fn(),
  }

  const mockEntityValidator = {
    Duplicate: jest.fn(),
  }

  const authContext = {id: '1', username: 'test'} as IAuthContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: BookRepository,
          useValue: mockBookRepository,
        },
        {
          provide: EntityValidator,
          useValue: mockEntityValidator,
        },
      ],
    }).compile()

    service = module.get<BooksService>(BooksService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getPublicBooks', () => {
    it('should return paginated public books', async () => {
      const paginatedDto: PaginationDTO = {page: 1, perPage: 10, sort: SortOrder.ASC}
      const data = []
      const totalItems = 0
      const result: I_PaginatedSuccess<BookDTO[]> = {
        items: data.map((book) => new BookDTO(book)),
        totalItems,
        page: paginatedDto.page,
        perPage: paginatedDto.perPage,
      }

      mockBookRepository.findAllPaginated.mockResolvedValue({data, totalItems})

      expect(await service.getPublicBooks(paginatedDto)).toEqual(result)
      expect(mockBookRepository.findAllPaginated).toHaveBeenCalledWith(
        paginatedDto.page,
        paginatedDto.perPage,
        {
          relations: {author: true},
          order: {createdAt: paginatedDto.sort},
        },
      )
    })

    it('should throw an error if fetching books fails', async () => {
      mockBookRepository.findAllPaginated.mockRejectedValue(new Error('Fetching failed'))

      await expect(
        service.getPublicBooks({page: 1, perPage: 10, sort: SortOrder.ASC}),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('publishBook', () => {
    it('should publish a new book', async () => {
      const publishBookDTO: PublishBookDTO = {title: 'New Book', isbn: '1234567890'}
      const book = {id: '1', title: 'New Book', isbn: '1234567890'} as BookEntity
      mockEntityValidator.Duplicate.mockResolvedValue(true)
      mockBookRepository.createBook.mockResolvedValue(book)

      const result: BookDTO = await service.publishBook(publishBookDTO, authContext)

      expect(result).toEqual(new BookDTO(book))
      expect(mockEntityValidator.Duplicate).toHaveBeenCalledWith({
        entity: BookEntity,
        entityColumn: 'isbn',
        fieldValue: publishBookDTO.isbn,
        exceptionMessage: 'Duplicate Book Number',
      })
      expect(mockBookRepository.createBook).toHaveBeenCalledWith(publishBookDTO, authContext.id)
    })

    it('should throw an error if publishing fails', async () => {
      mockEntityValidator.Duplicate.mockRejectedValue(new Error('Publishing failed'))

      await expect(
        service.publishBook({title: 'New Book', isbn: '1234567890'}, authContext),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('updateBook', () => {
    it('should update a book', async () => {
      const updateBookDTO: UpdateBookDTO = {title: 'Updated Book'}
      const book = {id: '1', title: 'Original Book', authorId: '1'}

      mockBookRepository.findOneBy.mockResolvedValue(book)
      mockBookRepository.updateBook.mockResolvedValue(true)
      mockBookRepository.findOneBy.mockResolvedValue({...book, title: 'Updated Book'})

      const result: BookDTO = await service.updateBook('1', updateBookDTO, authContext)

      expect(result).toEqual(new BookDTO({...book, title: 'Updated Book'} as BookEntity))
      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({id: '1', authorId: authContext.id})
      expect(mockBookRepository.updateBook).toHaveBeenCalledWith('1', updateBookDTO)
    })

    it('should throw an error if book not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null)

      await expect(service.updateBook('1', {title: 'Updated Book'}, authContext)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error if updating fails', async () => {
      mockBookRepository.findOneBy.mockResolvedValue({
        id: '1',
        title: 'Original Book',
        authorId: '1',
      })
      mockBookRepository.updateBook.mockRejectedValue(new Error('Updating failed'))

      await expect(service.updateBook('1', {title: 'Updated Book'}, authContext)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const book = {id: '1', title: 'Book to be deleted', authorId: '1'} as BookEntity

      mockBookRepository.findOneBy.mockResolvedValue(book)
      mockBookRepository.deleteBook.mockResolvedValue(true)

      const result: BookDTO = await service.deleteBook('1', authContext)

      expect(result).toEqual(new BookDTO(book))
      expect(mockBookRepository.findOneBy).toHaveBeenCalledWith({id: '1', authorId: authContext.id})
      expect(mockBookRepository.deleteBook).toHaveBeenCalledWith('1')
    })

    it('should throw an error if book not found', async () => {
      mockBookRepository.findOneBy.mockResolvedValue(null)

      await expect(service.deleteBook('1', authContext)).rejects.toThrow(NotFoundException)
    })

    it('should throw an error if deleting fails', async () => {
      mockBookRepository.findOneBy.mockResolvedValue({
        id: '1',
        title: 'Book to be deleted',
        authorId: '1',
      })
      mockBookRepository.deleteBook.mockRejectedValue(new Error('Deleting failed'))

      await expect(service.deleteBook('1', authContext)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })
})
