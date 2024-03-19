export function onDevFactory(condition: boolean) {
  return <P>(cb: () => P) => condition ? cb() : undefined
}

export function toLF(content: string) {
  return content.replace(/\r\n/g, '\n')
}
