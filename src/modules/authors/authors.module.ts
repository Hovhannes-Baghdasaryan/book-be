import {Module} from '@nestjs/common'
import {AuthorsService} from './authors.service'
import {AuthorsController} from './authors.controller'
import {JwtService} from '@nestjs/jwt'
import {EntityValidator} from '@validators/entity.validator'

@Module({
  providers: [AuthorsService, JwtService, EntityValidator],
  controllers: [AuthorsController],
})
export class AuthorsModule {}
