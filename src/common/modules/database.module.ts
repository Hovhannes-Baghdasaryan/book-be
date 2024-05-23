import {Module} from '@nestjs/common'
import {DataSource} from 'typeorm'
import {TypeOrmModule} from '@nestjs/typeorm'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {TypeOrmConfigService} from '@database-configurations/typeorm/typeorm-config.service'
import {
  TypeORMAllRepositories,
  TypeORMConfiguration,
} from '@database-configurations/typeorm/typeorm.configuration'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize()
      },
    }),
    TypeORMConfiguration,
  ],
  providers: [...TypeORMAllRepositories],
  exports: [TypeORMConfiguration, ...TypeORMAllRepositories],
})
export class DatabaseModule {}
