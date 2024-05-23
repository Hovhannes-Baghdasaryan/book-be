import {HttpException, HttpStatus} from '@nestjs/common'

export class DtoValidationException extends HttpException {
  constructor(
    message?: string | Record<string, unknown> | unknown,
    error = 'DTO Validation Error',
  ) {
    super(
      {statusCode: HttpStatus.BAD_REQUEST, error, message, code: HttpStatus.BAD_REQUEST},
      HttpStatus.BAD_REQUEST,
    )
  }
}
