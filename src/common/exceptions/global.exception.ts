import {ValidationError} from 'class-validator'
import {DtoValidationException} from '@exceptions/dto.exception'

type RecursiveValidationError = ValidationError & {children?: RecursiveValidationError[]}

type ErrorResult = Record<string, string[]>

export class GlobalValidationPipeDataTransform {
  constructor(errors: ValidationError[]) {
    throw new DtoValidationException(this.errorHandling(errors))
  }

  errorHandling(errors: RecursiveValidationError[]): ErrorResult {
    const finalResult: ErrorResult = {}

    errors.forEach((error) => {
      if (error.children && error.children.length > 0) {
        // Recursively handle child errors
        const childErrors = this.errorHandling(error.children)
        // Merge child errors with final result
        Object.assign(finalResult, childErrors)
      }

      // Add current error to final result
      finalResult[error.property] = Object.values(error.constraints || {})
    })

    return finalResult
  }
}
