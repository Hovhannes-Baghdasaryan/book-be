import {Injectable} from '@nestjs/common'
import {EntityExistsValidator} from './entity-exist.validator'

export interface IValidator<T> {
  ValidateAsync(data: T): Promise<void>
}
@Injectable()
export class BaseValidator {
  constructor(protected readonly entityExistsValidator: EntityExistsValidator) {}
}
