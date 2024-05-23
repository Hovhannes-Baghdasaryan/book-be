import {HttpStatus} from '@nestjs/common'
import {ApiHideProperty, ApiProperty} from '@nestjs/swagger'
import {IsArray} from 'class-validator'

export interface I_PaginatedSuccess<T = object> {
  items: T
  totalItems: number
  perPage: number
  page: number
  message?: string
  statusCode?: HttpStatus
}

export class PaginatedSuccessDTO<T = object> implements I_PaginatedSuccess<T> {
  @ApiProperty({default: HttpStatus.OK})
  statusCode: HttpStatus

  @ApiProperty()
  message: string

  @ApiHideProperty()
  @IsArray()
  items: T | null

  @ApiHideProperty()
  @ApiProperty({example: 15})
  totalItems: number

  @ApiHideProperty()
  @ApiProperty({example: 1})
  page: number

  @ApiHideProperty()
  @ApiProperty({example: 10})
  perPage: number

  constructor({
    statusCode = HttpStatus.OK,
    message = 'Action completed successfully',
    items = null,
    totalItems,
    page = 1,
    perPage = 10,
  }: I_PaginatedSuccess<T>) {
    this.statusCode = statusCode
    this.message = message
    this.items = items
    this.totalItems = totalItems
    this.page = page
    this.perPage = perPage
  }
}
