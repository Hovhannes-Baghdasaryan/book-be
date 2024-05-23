import * as bcrypt from 'bcrypt'
import {I_AppConfig} from '@config/app.config'
import {ConfigService} from '@nestjs/config'
import {Injectable} from '@nestjs/common'

@Injectable()
export class HashGenerator {
  private readonly appConfig: I_AppConfig

  constructor(private readonly configService: ConfigService) {
    this.appConfig = this.configService.get('app')
  }

  async hash(data: string): Promise<string> {
    return bcrypt.hash(data, this.appConfig.hashSalt)
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted)
  }
}
