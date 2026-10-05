export function getMissingEnvVars(keys: string[]) {
  return keys.filter((key) => !process.env[key] || process.env[key]?.trim() === '')
}

export function assertServerEnv(keys: string[], context = 'server configuration') {
  const missing = getMissingEnvVars(keys)

  if (missing.length > 0) {
    throw new Error(
      `Missing required ${context} environment variables: ${missing.join(', ')}`
    )
  }
}
