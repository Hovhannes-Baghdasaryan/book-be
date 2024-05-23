import {Test, TestingModule} from '@nestjs/testing'
import {AuthorsService} from './authors.service'
import {AuthorRepository} from '@repositories/typeorm'
import {EntityValidator} from '@validators/entity.validator'
import {BookRepository} from '@repositories/typeorm'
import {InternalServerErrorException} from '@nestjs/common'
import {AuthorDTO} from './dto/response/profile.response.dto'
import {UpdateAuthorDTO} from './dto/request/update-profile.request.dto'
import {PaginationDTO} from '@dto/paginationDTO'
import {IAuthContext} from '@decorators/auth.decorator'
import {I_PaginatedSuccess} from '@responses/paginated.dto'
import {I_Success, SuccessDTO} from '@responses/successDTO'
import {AuthorEntity} from '@entities/typeorm'
import {BookDTO} from '@modules/books/dto/response/book.response.dto'

describe('AuthorsService', () => {
  let service: AuthorsService

  const mockAuthorRepository = {
    deleteAuthor: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }

  const mockEntityValidator = {
    Duplicate: jest.fn(),
  }

  const mockBookRepository = {
    findAllPaginated: jest.fn(),
  }

  const authContext = {id: '1', username: 'test'} as IAuthContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: AuthorRepository,
          useValue: mockAuthorRepository,
        },
        {
          provide: EntityValidator,
          useValue: mockEntityValidator,
        },
        {
          provide: BookRepository,
          useValue: mockBookRepository,
        },
      ],
    }).compile()

    service = module.get<AuthorsService>(AuthorsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('deleteAuthor', () => {
    it('should delete author successfully', async () => {
      mockAuthorRepository.deleteAuthor.mockResolvedValue(true)

      const result: I_Success = await service.deleteAuthor(authContext)

      expect(result).toEqual(new SuccessDTO({message: 'Author Removed Successfully'}))
      expect(mockAuthorRepository.deleteAuthor).toHaveBeenCalledWith(authContext)
    })

    it('should throw an error if deletion fails', async () => {
      mockAuthorRepository.deleteAuthor.mockRejectedValue(new Error('Deletion failed'))

      await expect(service.deleteAuthor(authContext)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('getAuthorBooks', () => {
    it('should return paginated author books', async () => {
      const paginatedDto: PaginationDTO = {perPage: 10, page: 1}
      const data = []
      const totalItems = 0
      const result: I_PaginatedSuccess<BookDTO[]> = {
        items: data.map((book) => new BookDTO(book)),
        totalItems,
        page: paginatedDto.page,
        perPage: paginatedDto.perPage,
      }

      mockBookRepository.findAllPaginated.mockResolvedValue({data, totalItems})

      expect(await service.getAuthorBooks(paginatedDto, authContext)).toEqual(result)
      expect(mockBookRepository.findAllPaginated).toHaveBeenCalledWith(
        paginatedDto.page,
        paginatedDto.perPage,
        {
          where: {authorId: authContext.id},
          order: {createdAt: paginatedDto.sort},
        },
      )
    })

    it('should throw an error if fetching books fails', async () => {
      mockBookRepository.findAllPaginated.mockRejectedValue(new Error('Fetching failed'))

      await expect(service.getAuthorBooks({page: 1, perPage: 10}, authContext)).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })

  describe('getProfile', () => {
    it('should return author profile', async () => {
      const author = {id: '1'} as AuthorEntity
      mockAuthorRepository.findOne.mockResolvedValue(author)

      const result: AuthorDTO = await service.getProfile(authContext)

      expect(result).toEqual(new AuthorDTO(author))
      expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({
        where: {id: authContext.id},
      })
    })

    it('should throw an error if fetching profile fails', async () => {
      mockAuthorRepository.findOne.mockRejectedValue(new Error('Fetching failed'))

      await expect(service.getProfile(authContext)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('updateAuthor', () => {
    it('should update author profile', async () => {
      const updateAuthorDTO: UpdateAuthorDTO = {username: 'NewName'}
      const author = {id: '1'} as AuthorEntity

      mockEntityValidator.Duplicate.mockResolvedValue(true)
      mockAuthorRepository.update.mockResolvedValue(true)
      mockAuthorRepository.findOne.mockResolvedValue(author)

      const result: AuthorDTO = await service.updateAuthor(authContext, updateAuthorDTO)

      expect(result).toEqual(new AuthorDTO(author))
      expect(mockEntityValidator.Duplicate).toHaveBeenCalledWith({
        entity: AuthorEntity,
        entityColumn: 'username',
        fieldValue: updateAuthorDTO.username,
      })
      expect(mockAuthorRepository.update).toHaveBeenCalledWith(authContext.id, updateAuthorDTO)
      expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({
        where: {id: authContext.id},
        relations: {books: true},
      })
    })

    it('should throw an error if updating profile fails', async () => {
      mockEntityValidator.Duplicate.mockRejectedValue(new Error('Validation failed'))

      await expect(service.updateAuthor(authContext, {username: 'NewName'})).rejects.toThrow(
        InternalServerErrorException,
      )
    })
  })
})
