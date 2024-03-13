export function onDevFactory(condition: boolean) {
  return <P>(cb: () => P) => condition ? cb() : null
}
