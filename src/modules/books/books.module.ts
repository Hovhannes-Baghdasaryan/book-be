import {Module} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {BooksService} from './books.service'
import {BooksController} from './books.controller'
import {EntityValidator} from '@validators/entity.validator'

@Module({
  providers: [BooksService, EntityValidator, JwtService],
  controllers: [BooksController],
})
export class BooksModule {}
