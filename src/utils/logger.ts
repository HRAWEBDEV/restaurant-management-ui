type LogLevel = 'debug' | 'info' | 'warn' | 'error'

type LogPayload = Record<string, unknown>

type LogEntry = {
  timestamp: string
  level: LogLevel
  event: string
} & LogPayload

const CONSOLE_METHODS: Record<LogLevel, 'debug' | 'info' | 'warn' | 'error'> = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
}

function log(level: LogLevel, event: string, payload: LogPayload = {}): void {
  if (level === 'debug' && process.env.NODE_ENV === 'production') return

  const entry: LogEntry = {
    ...payload,
    timestamp: new Date().toISOString(),
    level,
    event,
  }

  console[CONSOLE_METHODS[level]](entry)
}

function logDebug(event: string, payload?: LogPayload): void {
  log('debug', event, payload)
}

function logInfo(event: string, payload?: LogPayload): void {
  log('info', event, payload)
}

function logWarn(event: string, payload?: LogPayload): void {
  log('warn', event, payload)
}

function logError(event: string, payload?: LogPayload): void {
  log('error', event, payload)
}

export { log, logDebug, logInfo, logWarn, logError }
export type { LogLevel, LogPayload, LogEntry }
