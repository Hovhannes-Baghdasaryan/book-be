import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'
import {Test, TestingModule} from '@nestjs/testing'
import {BadRequestException, InternalServerErrorException} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthorRepository} from '@repositories/typeorm'
import {HashGenerator} from '@helpers/auth.helper'
import {EntityValidator} from '@validators/entity.validator'
import {AuthDto} from './dto/response/auth.response.dto'
import {AuthorEntity} from '@entities/typeorm'
import {LoginDTO} from './dto/request/login.request.dto'
import {RegisterDTO} from './dto/request/register.request.dto'

describe('AuthService', () => {
  let authService: AuthService
  let authorRepository: AuthorRepository
  let hashGenerator: HashGenerator
  let entityValidator: EntityValidator
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthorRepository,
          useValue: {
            createAuthor: jest.fn(),
          },
        },
        {
          provide: HashGenerator,
          useValue: {
            hash: jest.fn(),
            compare: jest.fn(),
          },
        },
        {
          provide: EntityValidator,
          useValue: {
            Duplicate: jest.fn(),
            Exists: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'JWT_SECRET') {
                return 'testSecret'
              }
              if (key === 'JWT_EXPIRES_IN') {
                return '3600s'
              }
            }),
          },
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    authorRepository = module.get<AuthorRepository>(AuthorRepository)
    hashGenerator = module.get<HashGenerator>(HashGenerator)
    entityValidator = module.get<EntityValidator>(EntityValidator)
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('registerAuthor', () => {
    it('should register a new author', async () => {
      const registerDto: RegisterDTO = {username: 'testuser', password: 'testpass'}
      const newAuthor = {username: 'testuser'} as AuthorEntity
      jest.spyOn(entityValidator, 'Duplicate').mockResolvedValue(undefined)
      jest.spyOn(hashGenerator, 'hash').mockResolvedValue('testuser')
      jest.spyOn(authorRepository, 'createAuthor').mockResolvedValue(newAuthor)

      const result = await authService.registerAuthor(registerDto)
      expect(result).toEqual(new AuthDto(newAuthor))
    })
  })

  describe('loginAuthor', () => {
    it('should login an author', async () => {
      const loginDto: LoginDTO = {username: 'testuser', password: 'testpass'}
      const author = {username: 'testuser', password: 'hashedpass'} as AuthorEntity
      jest.spyOn(entityValidator, 'Exists').mockResolvedValue(author)
      jest.spyOn(hashGenerator, 'compare').mockResolvedValue(true)
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken')

      const result = await authService.loginAuthor(loginDto)
      expect(result).toEqual(new AuthDto(author, 'testToken'))
    })

    it('should throw BadRequestException if password is incorrect', async () => {
      const loginDto: LoginDTO = {username: 'testuser', password: 'wrongpass'}
      const author = {username: 'testuser', password: 'hashedpass'} as AuthorEntity
      jest.spyOn(entityValidator, 'Exists').mockResolvedValue(author)
      jest.spyOn(hashGenerator, 'compare').mockResolvedValue(false)

      await expect(authService.loginAuthor(loginDto)).rejects.toThrow(BadRequestException)
    })

    it('should throw InternalServerErrorException on error', async () => {
      const loginDto: LoginDTO = {username: 'testuser', password: 'testpass'}
      jest.spyOn(entityValidator, 'Exists').mockRejectedValue(new Error('Exists error'))

      await expect(authService.loginAuthor(loginDto)).rejects.toThrow(InternalServerErrorException)
    })
  })
})
