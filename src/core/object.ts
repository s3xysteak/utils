/**
 * @example get({ friends: [{ name: 'me' }] }, 'friends[0].name') // -> 'me'
 */
export function objectGet<TDefault = unknown>(value: any, path: string, defaultValue?: TDefault): TDefault {
  const segments = path.split(/[.[\]]/g)
  let current: any = value
  for (const key of segments) {
    if (current === null)
      return defaultValue as TDefault
    if (current === undefined)
      return defaultValue as TDefault
    const deQuoted = key.replace(/['"]/g, '')
    if (deQuoted.trim() === '')
      continue
    current = current[deQuoted]
  }
  if (current === undefined)
    return defaultValue as TDefault
  return current
}
