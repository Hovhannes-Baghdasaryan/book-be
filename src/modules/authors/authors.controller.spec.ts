import {Test, TestingModule} from '@nestjs/testing'
import {AuthorsController} from './authors.controller'
import {AuthorsService} from './authors.service'
import {AuthGuard} from '@guards/auth.guard'
import {PaginationDTO} from '@dto/paginationDTO'
import {AuthorDTO} from './dto/response/profile.response.dto'
import {BookAuthorDTO} from '../books/dto/response/book.response.dto'
import {UpdateAuthorDTO} from './dto/request/update-profile.request.dto'
import {IAuthContext} from '@decorators/auth.decorator'
import {I_PaginatedSuccess, PaginatedSuccessDTO} from '@responses/paginated.dto'
import {I_Success, SuccessDTO} from '@responses/successDTO'
import {SortOrder} from '@enums/sort-order.enum'

describe('AuthorsController', () => {
  let controller: AuthorsController
  let service: AuthorsService

  const mockAuthorsService = {
    getAuthorBooks: jest.fn(),
    getProfile: jest.fn(),
    updateAuthor: jest.fn(),
    deleteAuthor: jest.fn(),
  }

  const authContext = {id: '1', username: 'test'} as IAuthContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [
        {
          provide: AuthorsService,
          useValue: mockAuthorsService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({canActivate: jest.fn(() => true)})
      .compile()

    controller = module.get<AuthorsController>(AuthorsController)
    service = module.get<AuthorsService>(AuthorsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('authorBooks', () => {
    it('should return paginated author books', async () => {
      const paginatedDTO: PaginationDTO = {page: 1, perPage: 10, sort: SortOrder.ASC}
      const result: I_PaginatedSuccess<BookAuthorDTO[]> = new PaginatedSuccessDTO({
        items: [],
        totalItems: 0,
        perPage: 10,
        page: 1,
      })

      jest.spyOn(service, 'getAuthorBooks').mockResolvedValue(result)

      expect(await controller.authorBooks(paginatedDTO, authContext)).toEqual(result)
      expect(service.getAuthorBooks).toHaveBeenCalledWith(paginatedDTO, authContext)
    })

    it('should throw an error if fetching books fails', async () => {
      jest.spyOn(service, 'getAuthorBooks').mockRejectedValue(new Error('Fetching failed'))

      await expect(
        controller.authorBooks({page: 1, perPage: 10, sort: SortOrder.DESC}, authContext),
      ).rejects.toThrow()
    })
  })

  describe('getProfile', () => {
    it('should return author profile', async () => {
      const result = {} as AuthorDTO

      jest.spyOn(service, 'getProfile').mockResolvedValue(result)

      expect(await controller.getProfile(authContext)).toEqual(new SuccessDTO({data: result}))
      expect(service.getProfile).toHaveBeenCalledWith(authContext)
    })

    it('should throw an error if fetching profile fails', async () => {
      jest.spyOn(service, 'getProfile').mockRejectedValue(new Error('Fetching failed'))

      await expect(controller.getProfile(authContext)).rejects.toThrow()
    })
  })

  describe('updateAuthor', () => {
    it('should update author profile', async () => {
      const updateAuthorDTO: UpdateAuthorDTO = {username: 'NewName'}
      const result = {} as AuthorDTO

      jest.spyOn(service, 'updateAuthor').mockResolvedValue(result)

      expect(await controller.updateAuthor(authContext, updateAuthorDTO)).toEqual(
        new SuccessDTO({data: result} as I_Success),
      )
      expect(service.updateAuthor).toHaveBeenCalledWith(authContext, updateAuthorDTO)
    })

    it('should throw an error if updating profile fails', async () => {
      jest.spyOn(service, 'updateAuthor').mockRejectedValue(new Error('Updating failed'))

      await expect(controller.updateAuthor(authContext, {username: 'NewName'})).rejects.toThrow()
    })
  })

  describe('deleteAuthor', () => {
    it('should delete author successfully', async () => {
      const result: I_Success = new SuccessDTO({message: 'Author Removed Successfully'})

      jest.spyOn(service, 'deleteAuthor').mockResolvedValue(result)

      expect(await controller.deleteAuthor(authContext)).toEqual(result)
      expect(service.deleteAuthor).toHaveBeenCalledWith(authContext)
    })

    it('should throw an error if deleting author fails', async () => {
      jest.spyOn(service, 'deleteAuthor').mockRejectedValue(new Error('Deletion failed'))

      await expect(controller.deleteAuthor(authContext)).rejects.toThrow()
    })
  })
})
