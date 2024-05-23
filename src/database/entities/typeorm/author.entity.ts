import {Column, Entity, OneToMany, Relation} from 'typeorm'
import {RegularEntity} from 'common/entities/regular.entity'
import {BookEntity} from './book.entity'

@Entity({name: 'authors'})
export class AuthorEntity extends RegularEntity {
  @Column({type: 'varchar', unique: true, length: 255})
  username: string

  @Column({type: 'varchar', nullable: false, length: 255})
  password: string

  @Column({type: 'varchar', nullable: true, length: 2000})
  biography?: string

  @Column({type: 'timestamp', nullable: true})
  birthdate?: Date

  @OneToMany(() => BookEntity, (book) => book.author)
  books: Relation<BookEntity>[]
}
