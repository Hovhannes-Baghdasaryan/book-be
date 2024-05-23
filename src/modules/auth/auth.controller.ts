import {Body, Controller, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {SuccessDTO} from '@responses/successDTO'
import {AuthDto} from './dto/response/auth.response.dto'
import {RegisterDTO} from './dto/request/register.request.dto'
import {LoginDTO} from './dto/request/login.request.dto'
import {ApiTags} from '@nestjs/swagger'
import {ApiOutputDecorator} from '@decorators/output-openapi.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOutputDecorator(AuthDto)
  async register(@Body() registerDto: RegisterDTO): Promise<SuccessDTO<AuthDto>> {
    const response = await this.authService.registerAuthor(registerDto)
    return new SuccessDTO({data: response})
  }

  @Post('login')
  @ApiOutputDecorator(AuthDto)
  async login(@Body() loginDto: LoginDTO): Promise<SuccessDTO<AuthDto>> {
    const response = await this.authService.loginAuthor(loginDto)
    return new SuccessDTO({data: response})
  }
}
