import {Column, Entity, JoinTable, ManyToOne, Relation} from 'typeorm'
import {RegularEntity} from '@common/entities/regular.entity'
import {AuthorEntity} from './author.entity'

@Entity({name: 'books'})
export class BookEntity extends RegularEntity {
  @Column({type: 'varchar', length: 255})
  title: string

  @Column({type: 'varchar', unique: true, length: 100})
  isbn: string

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  published_at: Date

  @Column()
  authorId: string

  @ManyToOne(() => AuthorEntity, (author) => author.books, {onDelete: 'CASCADE'})
  @JoinTable({name: 'authorId'})
  author: Relation<AuthorEntity>
}
