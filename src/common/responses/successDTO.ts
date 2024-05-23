import {HttpStatus} from '@nestjs/common'
import {ApiProperty} from '@nestjs/swagger'

export interface I_Success<T = object> {
  data?: T
  message?: string
  statusCode?: HttpStatus
}

export class SuccessDTO<T = object> implements I_Success<T> {
  @ApiProperty({default: HttpStatus.OK})
  statusCode: HttpStatus

  @ApiProperty()
  message: string

  @ApiProperty()
  data: T | null

  constructor({
    statusCode = HttpStatus.OK,
    message = 'Action completed successfully',
    data = null,
  }: I_Success<T>) {
    this.statusCode = statusCode
    this.message = message

    if (data) {
      this.data = data
    }
  }
}
