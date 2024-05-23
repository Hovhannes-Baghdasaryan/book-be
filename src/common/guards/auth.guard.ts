import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {AuthorRepository} from '@repositories/typeorm'
import {AuthorEntity} from '@entities/typeorm'
import {INVALID_AUTH_TOKEN} from '@errors/auth.errors'
import {IAuthContext} from '@decorators/auth.decorator'
import {ConfigService} from '@nestjs/config'
import {LogError} from '@helpers/logger.helper'
import * as activityLogs from '@enums/active-logs'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authorRepository: AuthorRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization?.split(' ')[1]
    const decodedAuthor = await this.validateAuthor(token)

    if (!decodedAuthor) {
      LogError(activityLogs.AuthLogsFunctions.AuthGuard, activityLogs.LogsActions.Failed, {
        message: INVALID_AUTH_TOKEN,
      })
      throw new UnauthorizedException(INVALID_AUTH_TOKEN)
    }

    req.author = {
      id: decodedAuthor.id,
      username: decodedAuthor.username,
    } as IAuthContext

    return true
  }

  async validateAuthor(token: string): Promise<AuthorEntity> {
    try {
      const verifiedAuthor: IAuthContext = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      return this.authorRepository.findOneBy({id: verifiedAuthor.id})
    } catch (error) {
      LogError(activityLogs.AuthLogsFunctions.AuthGuard, activityLogs.LogsActions.Failed, {
        message: error,
      })
      throw new UnauthorizedException(INVALID_AUTH_TOKEN)
    }
  }
}
