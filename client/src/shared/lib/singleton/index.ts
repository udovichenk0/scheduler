import { Unit } from "effector"

export const singleton = <T extends Record<string, Unit<unknown>>>(
  factory: () => T,
) => {
  const $$model = factory()
  return $$model
}
