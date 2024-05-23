import {Logger} from '@nestjs/common'

export type LoggerContext = {
  functionName: string
  eventName: string
}

export const loggerPayload = <T>(context: LoggerContext, data: T): LoggerContext & T => {
  const {functionName, eventName} = context

  return {functionName, eventName, ...data}
}

export const LogInfo = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.log(loggerPayload({functionName, eventName}, data))
}

export const LogWarn = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.warn(loggerPayload({functionName, eventName}, data))
}

export const LogError = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.error(loggerPayload({functionName, eventName}, {...data, message: data.message}))
}
