import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {GlobalModule} from 'common/modules/global.module'
import {AuthModule} from './modules/auth/auth.module'
import {AuthorsModule} from './modules/authors/authors.module'
import {BooksModule} from './modules/books/books.module'

@Module({
  imports: [GlobalModule, AuthModule, AuthorsModule, BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
