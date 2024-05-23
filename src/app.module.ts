import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {GlobalModule} from 'common/modules/global.module'
import {AuthModule} from './modules/auth/auth.module'
import {UsersModule} from './modules/users/users.module'

@Module({
  imports: [GlobalModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
