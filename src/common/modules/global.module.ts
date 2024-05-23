import {Global, Logger, Module} from '@nestjs/common'
import {DatabaseModule} from './database.module'
import {ConfigModule} from '@nestjs/config'
import {configApp, configPostgres} from '@config/index'

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configApp, configPostgres],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
  ],
  exports: [DatabaseModule],
  providers: [Logger],
})
export class GlobalModule {}
