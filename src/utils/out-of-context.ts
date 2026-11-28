class OutOfContextError extends Error {
  readonly hookName: string
  readonly providerName: string

  constructor(hookName: string, providerName: string) {
    super(`\`${hookName}\` was called outside of its provider. Wrap the component in the corresponding \`<${providerName}>\`.`)
    this.name = 'OutOfContextError'
    this.hookName = hookName
    this.providerName = providerName
  }
}

export { OutOfContextError }
