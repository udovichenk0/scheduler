export const singleton = <T>(factory: () => T) => {
  const $$model = factory()
  return $$model
}
