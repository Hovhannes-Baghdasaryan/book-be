import {registerAs} from '@nestjs/config'

export interface I_AppConfig {
  nodeEnv: string
  name: string
  frontendDomain: string
  port: number
  apiPrefix: string
  hashSalt: number
}

export default registerAs(
  'app',
  (): I_AppConfig => ({
    nodeEnv: process.env.NODE_ENV,
    name: process.env.APP_NAME,
    frontendDomain: process.env.FRONTEND_DOMAIN,
    port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 4000,
    hashSalt: parseInt(process.env.HASH_SALT, 10),
    apiPrefix: process.env.API_PREFIX,
  }),
)
