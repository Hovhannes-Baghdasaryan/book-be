import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('typeorm.type'),
      host: this.configService.get('typeorm.host'),
      port: this.configService.get('typeorm.port'),
      username: this.configService.get('typeorm.username'),
      password: this.configService.get('typeorm.password'),
      database: this.configService.get('typeorm.name'),
      synchronize: this.configService.get('typeorm.synchronize'),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('app.nodeEnv') !== 'production',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
    } as TypeOrmModuleOptions;
  }
}
