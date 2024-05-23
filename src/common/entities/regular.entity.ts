import {instanceToPlain} from 'class-transformer'
import {
  AfterLoad,
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class RegularEntity extends BaseEntity {
  __entity?: string

  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @AfterLoad()
  setEntityName(): void {
    this.__entity = this.constructor.name
  }

  toJSON(): Record<string, RegularEntity> {
    return instanceToPlain(this)
  }
}
