import {Body, Controller, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {RegisterDTO} from './dto/request/auth.request.dto'
import {ResSuccessDto} from '@responses/resSuccess.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerRequest: RegisterDTO) {
    const response = await this.authService.registerUser(registerRequest)
    return new ResSuccessDto({data: response})
  }
}
