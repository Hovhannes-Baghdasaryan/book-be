import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common'
import {AuthService} from '@apps/users/auth/services/auth.service'

/**
 * Global auth guard to handle different types of auth based on handler metadata
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  /**
   * Verify session cookie by default
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = req.headers.authorization.split(' ')[1]
    const decodedPatient = await this.authService.validatePatient(token)

    req.raw.locals = {}
    if (decodedPatient) {
      req.raw.locals.session = {
        id: decodedPatient.id,
        email: decodedPatient.email,
        uuid: decodedPatient.uuid,
        role: decodedPatient.role,
        stripeCustomerId: decodedPatient.stripeCustomerId,
        writingAccess: decodedPatient.writingAccess,
      }
    }

    return true
  }
}
