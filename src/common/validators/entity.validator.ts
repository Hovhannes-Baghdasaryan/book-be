import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common'
import {EntityManager, ObjectType} from 'typeorm'
import {RegularEntity} from '../entities/regular.entity'

@Injectable()
export class EntityValidator {
  constructor(private readonly entityManager: EntityManager) {}

  async Duplicate<T extends RegularEntity>({
    entity,
    entityColumn,
    fieldValue = '',
    exceptionMessage = `${entityColumn.toString().toUpperCase()}_ALREADY_EXISTS`,
  }: {
    entity: ObjectType<T>
    entityColumn: keyof T
    fieldValue: string | number
    exceptionMessage?: string
  }): Promise<void> {
    const repository = this.entityManager.getRepository<RegularEntity>(entity)

    const foundData = await repository.findOne({
      where: {
        [entityColumn]: fieldValue,
      },
    })

    if (foundData) {
      throw new BadRequestException(exceptionMessage)
    }
  }

  async Exists<T extends RegularEntity>({
    entity,
    entityColumn,
    fieldValue,
    exceptionMessage = `${entityColumn.toString()}_NOT_FOUND`,
  }: {
    entity: ObjectType<T>
    entityColumn: keyof T
    fieldValue: string | number
    exceptionMessage?: string
  }): Promise<RegularEntity> {
    const repository = this.entityManager.getRepository<RegularEntity>(entity)

    const foundData = await repository.findOne({
      where: {
        [entityColumn]: fieldValue,
      },
    })

    if (!foundData) {
      throw new NotFoundException(exceptionMessage)
    }

    return foundData
  }
}
