import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { log } from '@utils/logger'

describe('log', () => {
  let debugSpy: ReturnType<typeof vi.spyOn>
  let infoSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  test('writes an info entry with timestamp, level, event and payload', () => {
    log('info', 'event_name', { userId: 42 })

    expect(infoSpy).toHaveBeenCalledTimes(1)

    const entry = infoSpy.mock.calls[0][0]
    expect(entry).toMatchObject({ level: 'info', event: 'event_name', userId: 42 })
    expect(typeof entry.timestamp).toBe('string')
    expect(Number.isNaN(Date.parse(entry.timestamp))).toBe(false)
  })

  test('routes each level to its matching console method', () => {
    log('debug', 'd_event')
    log('info', 'i_event')
    log('warn', 'w_event')
    log('error', 'e_event')

    expect(debugSpy).toHaveBeenCalledTimes(1)
    expect(infoSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })

  test('payload cannot overwrite timestamp, level or event', () => {
    log('warn', 'event_name', { level: 'fake', event: 'fake', timestamp: 'fake' })

    const entry = warnSpy.mock.calls[0][0]
    expect(entry.level).toBe('warn')
    expect(entry.event).toBe('event_name')
    expect(entry.timestamp).not.toBe('fake')
  })

  test('works without a payload', () => {
    log('error', 'event_name')

    expect(errorSpy.mock.calls[0][0]).toMatchObject({ level: 'error', event: 'event_name' })
  })

  test('supresses debug entries in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    log('debug', 'event_name')

    expect(debugSpy).not.toHaveBeenCalled()
  })

  test('writes non-debug levels in production', () => {
    vi.stubEnv('NODE_ENV', 'production')

    log('error', 'event_name')

    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
