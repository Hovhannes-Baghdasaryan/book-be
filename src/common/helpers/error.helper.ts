import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import {DtoValidationException} from '../exceptions/dto.exception'

export const handleError = (error: Error): void => {
  const exceptions = [
    NotFoundException,
    DtoValidationException,
    InternalServerErrorException,
    UnprocessableEntityException,
    BadRequestException,
    UnauthorizedException,
    BadRequestException,
  ]

  // handle instantiated errors for throwing the exceptions of the same type as the input error
  for (const exceptionType of exceptions) {
    if (error instanceof exceptionType) {
      throw error
    }
  }
}
