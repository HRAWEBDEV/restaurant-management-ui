import { describe, expect, it } from 'vitest'

import { OutOfContextError } from '../out-of-context'

describe('OutOfContextError', () => {
  const HOOK_NAME = 'useApp'
  const PROVIDER_NAME = 'AppProvider'

  it('sets the error name', () => {
    const error = new OutOfContextError(HOOK_NAME, PROVIDER_NAME)

    expect(error.name).toBe('OutOfContextError')
  })

  it('stores the hook name', () => {
    const error = new OutOfContextError(HOOK_NAME, PROVIDER_NAME)

    expect(error.hookName).toBe(HOOK_NAME)
  })

  it('stores the provider name', () => {
    const error = new OutOfContextError(HOOK_NAME, PROVIDER_NAME)

    expect(error.providerName).toBe(PROVIDER_NAME)
  })

  it('builds a descriptive message including both names', () => {
    const error = new OutOfContextError(HOOK_NAME, PROVIDER_NAME)

    expect(error.message).toContain(HOOK_NAME)
    expect(error.message).toContain(PROVIDER_NAME)
  })

  it('is an instance of Error', () => {
    expect(new OutOfContextError(HOOK_NAME, PROVIDER_NAME)).toBeInstanceOf(Error)
  })
})
