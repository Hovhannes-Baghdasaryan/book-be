import {Injectable, InternalServerErrorException} from '@nestjs/common'
import {RegisterDTO} from './dto/request/auth.request.dto'
import {UsersRepository} from '@repositories/typeorm'
import {HashGenerator} from '@helpers/auth.helper'
import {AuthDto} from './dto/response/auth.response.dto'
import {handleError} from '@helpers/error.helper'
import {LogError} from '@helpers/logger.helper'
import * as activityLogs from '@enums/active-logs'
import {UserEntity} from '@entities/typeorm'
import {EntityValidator} from '@validators/entity.validator'

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly entityValidator: EntityValidator,
  ) {}

  async registerUser(registerDto: RegisterDTO) {
    try {
      await this.entityValidator.Duplicate({
        entity: UserEntity,
        entityColumn: 'email',
        fieldValue: registerDto.email,
      })
      await this.entityValidator.Duplicate({
        entity: UserEntity,
        entityColumn: 'username',
        fieldValue: registerDto.username,
      })

      registerDto.password = await this.hashGenerator.hash(registerDto.password)
      const newUser = await this.userRepository.createUser(registerDto)

      return new AuthDto(newUser)
    } catch (error) {
      LogError(activityLogs.AuthLogsFunctions.RegisterUser, activityLogs.LogsActions.Failed, {
        message: error,
      })
      handleError(error)
      throw new InternalServerErrorException('USER_REGISTER_INTERNAL')
    }
  }
}
