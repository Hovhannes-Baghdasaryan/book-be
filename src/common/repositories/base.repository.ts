import {Repository} from 'typeorm'
import {FIND_ALL_DATA_ERROR} from '@errors/global.errors'
import {InternalServerErrorException} from '@nestjs/common'
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions'
import {FindOptionsOrder} from 'typeorm/find-options/FindOptionsOrder'

export class BaseRepository<T> extends Repository<T> {
  async findAll(
    pageNumber: number,
    pageSize: number,
    findManyOptions?: FindManyOptions<T> & FindOptionsOrder<T>,
  ): Promise<{data: T[]; totalItems: number}> {
    try {
      const page = pageNumber ? pageNumber : 1

      const query = {
        ...findManyOptions,
        relations: {...findManyOptions?.relations},
        where:
          findManyOptions?.where instanceof Array && findManyOptions?.where?.length
            ? [...findManyOptions?.where]
            : {...findManyOptions?.where},
        order: {...findManyOptions?.order},
        take: pageSize,
        skip: (page - 1) * pageSize,
      }

      const [data, totalItems] = await this.findAndCount(query)

      return {data, totalItems}
    } catch (error) {
      throw new InternalServerErrorException(FIND_ALL_DATA_ERROR)
    }
  }
}
