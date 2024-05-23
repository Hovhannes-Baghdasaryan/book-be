import {applyDecorators, Type} from '@nestjs/common'
import {ApiExtraModels, ApiOkResponse, getSchemaPath} from '@nestjs/swagger'

export const ApiOutputDecorator = <T extends Type<unknown>>(
  ModelDTO: T,
): MethodDecorator & ClassDecorator => {
  return applyDecorators(
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          data: {
            $ref: getSchemaPath(ModelDTO),
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
