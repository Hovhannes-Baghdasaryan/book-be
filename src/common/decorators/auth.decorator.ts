import {
  ExecutionContext,
  createParamDecorator,
  applyDecorators,
  UseGuards,
  CanActivate,
  Type,
} from '@nestjs/common'
import {JwtPayload} from 'jsonwebtoken'
import {ApiBearerAuth} from '@nestjs/swagger'

export interface IAuthContext extends JwtPayload {
  id: string
  username: string
}

export const AuthContextDecorator = createParamDecorator(
  (_, ctx: ExecutionContext): IAuthContext => {
    const request = ctx.switchToHttp().getRequest()
    return request.author
  },
)

export const ApiAuthBearerDecorator = (
  guard: Type<CanActivate>,
): MethodDecorator & ClassDecorator => {
  return applyDecorators(UseGuards(guard), ApiBearerAuth())
}
