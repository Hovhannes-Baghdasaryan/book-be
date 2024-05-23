import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common'
import {AuthorRepository} from '@repositories/typeorm'
import {HashGenerator} from '@helpers/auth.helper'
import {AuthDto} from './dto/response/auth.response.dto'
import {handleError} from '@helpers/error.helper'
import {LogError} from '@helpers/logger.helper'
import * as activityLogs from '@enums/active-logs'
import {AuthorEntity} from '@entities/typeorm'
import {EntityValidator} from '@validators/entity.validator'
import {USERNAME_OR_PASSWORD_INCORRECT} from '@errors/auth.errors'
import {IAuthContext} from '@decorators/auth.decorator'
import {ConfigService} from '@nestjs/config'
import {JwtService} from '@nestjs/jwt'
import {RegisterDTO} from './dto/request/register.request.dto'
import {LoginDTO} from './dto/request/login.request.dto'

@Injectable()
export class AuthService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly entityValidator: EntityValidator,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async registerAuthor(registerDto: RegisterDTO): Promise<AuthDto> {
    try {
      await this.entityValidator.Duplicate({
        entity: AuthorEntity,
        entityColumn: 'username',
        fieldValue: registerDto.username,
      })

      registerDto.password = await this.hashGenerator.hash(registerDto.password)
      const newAuthor = await this.authorRepository.createAuthor(registerDto)

      return new AuthDto(newAuthor)
    } catch (error) {
      LogError(activityLogs.AuthLogsFunctions.RegisterAuthor, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('AUTHOR_REGISTER_INTERNAL')
    }
  }

  async loginAuthor(loginDto: LoginDTO): Promise<AuthDto> {
    try {
      const author = (await this.entityValidator.Exists({
        entity: AuthorEntity,
        entityColumn: 'username',
        fieldValue: loginDto.username,
        exceptionMessage: USERNAME_OR_PASSWORD_INCORRECT,
      })) as AuthorEntity

      const isPasswordValid = await this.hashGenerator.compare(loginDto.password, author.password)
      if (!isPasswordValid) {
        LogError(activityLogs.AuthLogsFunctions.LoginAuthor, activityLogs.LogsActions.Failed, {
          message: USERNAME_OR_PASSWORD_INCORRECT,
        })
        throw new BadRequestException(USERNAME_OR_PASSWORD_INCORRECT)
      }

      const jwtPayload: IAuthContext = {
        id: author.id,
        username: author.username,
      }
      const accessToken = await this.jwtService.signAsync(jwtPayload, {
        privateKey: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      })

      return new AuthDto(author, accessToken)
    } catch (error) {
      LogError(activityLogs.AuthLogsFunctions.LoginAuthor, activityLogs.LogsActions.Failed, {
        message: error.message,
      })
      handleError(error)
      throw new InternalServerErrorException('AUTHOR_LOGIN_INTERNAL')
    }
  }
}
