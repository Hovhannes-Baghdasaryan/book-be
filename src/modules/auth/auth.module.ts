import {JwtModule, JwtService} from '@nestjs/jwt'
import {Module} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthController} from './auth.controller'
import {HashGenerator} from '@helpers/auth.helper'
import {EntityValidator} from '@validators/entity.validator'
import {ConfigModule, ConfigService} from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: configService.get('JWT_EXPIRES_IN')},
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, HashGenerator, EntityValidator, JwtService],
})
export class AuthModule {}
