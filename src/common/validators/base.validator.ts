import {Injectable} from '@nestjs/common'
import {EntityValidator} from './entity.validator'

export interface IValidator<T> {
  ValidateAsync(data: T): Promise<void>
}
@Injectable()
export class BaseValidator {
  constructor(protected readonly entityValidator: EntityValidator) {}
}
