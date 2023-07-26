export {}

declare global {
  type Keys<T> = keyof T
  type Nullable<T> = T | null
}
