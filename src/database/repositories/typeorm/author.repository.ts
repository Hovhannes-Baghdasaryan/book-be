import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {BaseRepository} from 'common/repositories'
import {AuthorEntity} from '@entities/typeorm/author.entity'
import {RegisterDTO} from 'modules/auth/dto/request/auth.request.dto'

@Injectable()
export class AuthorRepository extends BaseRepository<AuthorEntity> {
  @InjectRepository(AuthorEntity) authorRepository: Repository<AuthorEntity>

  constructor(public dataSource: DataSource) {
    super(AuthorEntity, dataSource.createEntityManager())
  }

  async createAuthor(registerDto: RegisterDTO): Promise<AuthorEntity> {
    return this.save({
      username: registerDto.username,
      password: registerDto.password,
      birthdate: registerDto.birthdate,
      biography: registerDto.biography,
    })
  }

  findByUsername(username: string): Promise<AuthorEntity> {
    return this.findOneBy({username})
  }
}
