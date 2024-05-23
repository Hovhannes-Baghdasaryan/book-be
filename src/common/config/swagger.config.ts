import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import {NestExpressApplication} from '@nestjs/platform-express'

const setupSwagger = (app: NestExpressApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Test Dev Ops App')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}

export default setupSwagger
