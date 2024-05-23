import {applyDecorators, Type} from '@nestjs/common'
import {ApiExtraModels, ApiOkResponse, getSchemaPath} from '@nestjs/swagger'

export const ApiPaginatedOutputDecorator = <T extends Type<unknown>>(
  ModelDTO: T,
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: getSchemaPath(ModelDTO),
            },
          },
          totalItems: {
            type: 'number',
            example: 15,
          },
          page: {
            type: 'number',
            example: 1,
          },
          perPage: {
            type: 'number',
            example: 10,
          },
          status: {
            type: 'number',
            example: 200,
          },
          message: {
            type: 'string',
            example: 'Action completed successfully',
          },
        },
      },
    }),
  )
}
