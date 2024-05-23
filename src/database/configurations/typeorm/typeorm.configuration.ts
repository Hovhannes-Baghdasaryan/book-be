import {UserEntity} from '@entities/typeorm'
import {TypeOrmModule} from '@nestjs/typeorm'
import {UsersRepository} from '@repositories/typeorm'

export const TypeORMAllEntities = [UserEntity]

export const TypeORMAllRepositories = [UsersRepository]

export const TypeORMConfiguration = TypeOrmModule.forFeature([
  ...TypeORMAllEntities,
  ...TypeORMAllRepositories,
])
