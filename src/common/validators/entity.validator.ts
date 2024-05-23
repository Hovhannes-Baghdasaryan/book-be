import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common'
import {EntityManager, In, ObjectType} from 'typeorm'
import {RegularEntity} from '../entities/regular.entity'

@Injectable()
export class EntityExistsValidator {
  constructor(private readonly entityManager: EntityManager) {}

  async Exists<T extends RegularEntity>(
    entity: ObjectType<T>,
    entityColumn: keyof T,
    fieldValue: string | number,
    exceptionMessage = `${entityColumn.toString()}_NOT_FOUND`,
  ): Promise<RegularEntity> {
    const repository = this.entityManager.getRepository<RegularEntity>(entity)
    const foundData = await repository.findOne({where: {[entityColumn]: fieldValue}})
    if (!foundData) {
      throw new NotFoundException(exceptionMessage)
    }

    return foundData
  }

  async ExistsList<T extends RegularEntity>(entity: ObjectType<T>, ids: number[]): Promise<void> {
    const repository = this.entityManager.getRepository<RegularEntity>(entity)

    const existingIds = (await repository.find({where: {id: In(ids)}, select: ['id']})).map(
      (x) => x.id,
    )

    const nonExistingIds = ids.filter((id) => {
      return !existingIds.includes(id)
    })

    if (existingIds.length !== ids.length) {
      throw new HttpException(
        `${entity.name} with ids ${nonExistingIds.join(',')} not found`,
        HttpStatus.NOT_FOUND,
      )
    }
  }
}
