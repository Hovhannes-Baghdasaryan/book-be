import {Column, Entity} from 'typeorm'
import {RegularEntity} from 'common/entities/regular.entity'

@Entity({name: 'author'})
export class AuthorEntity extends RegularEntity {
  @Column({type: 'varchar', length: 255})
  username: string

  @Column({type: 'varchar', length: 255})
  password: string

  @Column({type: 'varchar', length: 2000})
  biography: string

  @Column({type: 'timestamp'})
  birthdate: Date
}
