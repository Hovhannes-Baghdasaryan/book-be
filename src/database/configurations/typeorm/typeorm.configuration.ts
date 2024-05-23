import {TypeOrmModule} from '@nestjs/typeorm'
import {AuthorEntity, BookEntity} from '@entities/typeorm'
import {AuthorRepository, BookRepository} from '@repositories/typeorm'

export const TypeORMAllEntities = [AuthorEntity, BookEntity]

export const TypeORMAllRepositories = [AuthorRepository, BookRepository]

export const TypeORMConfiguration = TypeOrmModule.forFeature([
  ...TypeORMAllEntities,
  ...TypeORMAllRepositories,
])
