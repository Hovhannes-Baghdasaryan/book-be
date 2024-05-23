import {Module} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthController} from './auth.controller'
import {HashGenerator} from '@helpers/auth.helper'
import {EntityValidator} from '@validators/entity.validator'

@Module({
  controllers: [AuthController],
  providers: [AuthService, HashGenerator, EntityValidator],
})
export class AuthModule {}
