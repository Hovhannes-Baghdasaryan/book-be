import {Test, TestingModule} from '@nestjs/testing'
import {AuthController} from './auth.controller'
import {AuthDto} from './dto/response/auth.response.dto'
import {SuccessDTO} from '@responses/successDTO'
import {AuthService} from './auth.service'
import {RegisterDTO} from './dto/request/register.request.dto'
import {LoginDTO} from './dto/request/login.request.dto'
import {AuthorEntity} from '@entities/typeorm'

describe('AuthController', () => {
  let authController: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerAuthor: jest.fn(),
            loginAuthor: jest.fn(),
          },
        },
      ],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  describe('register', () => {
    it('should register an author and return response', async () => {
      const registerDto: RegisterDTO = {username: 'testuser', password: 'testpass'}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const authDto: AuthDto = new AuthDto({username: 'testuser'})
      jest.spyOn(authService, 'registerAuthor').mockResolvedValue(authDto)

      const result = await authController.register(registerDto)
      expect(result).toEqual(new SuccessDTO({data: authDto}))
      expect(authService.registerAuthor).toHaveBeenCalledWith(registerDto)
    })
  })

  describe('login', () => {
    it('should login an author and return response', async () => {
      const loginDto: LoginDTO = {username: 'testuser', password: 'testpass'}
      const authorResponseData = {username: 'testuser'} as AuthorEntity

      const authDto: AuthDto = new AuthDto(authorResponseData, 'testToken')
      jest.spyOn(authService, 'loginAuthor').mockResolvedValue(authDto)

      const result = await authController.login(loginDto)
      expect(result).toEqual(new SuccessDTO({data: authDto}))
      expect(authService.loginAuthor).toHaveBeenCalledWith(loginDto)
    })
  })
})
