import {Injectable} from '@nestjs/common'
import {AuthorEntity} from '@entities/typeorm'
import {InjectRepository} from '@nestjs/typeorm'
import {BaseRepository} from 'common/repositories'
import {IAuthContext} from '@decorators/auth.decorator'
import {DataSource, DeleteResult, Repository} from 'typeorm'
import {RegisterDTO} from 'modules/auth/dto/request/register.request.dto'

@Injectable()
export class AuthorRepository extends BaseRepository<AuthorEntity> {
  @InjectRepository(AuthorEntity) authorRepository: Repository<AuthorEntity>

  constructor(public dataSource: DataSource) {
    super(AuthorEntity, dataSource.createEntityManager())
  }

  createAuthor(registerDto: RegisterDTO): Promise<AuthorEntity> {
    return this.save({
      username: registerDto.username,
      password: registerDto.password,
      birthdate: registerDto.birthdate,
      biography: registerDto.biography,
    })
  }

  deleteAuthor(authContext: IAuthContext): Promise<DeleteResult> {
    return this.softDelete({
      id: authContext.id,
    })
  }
}
