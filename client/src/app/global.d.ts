export {}

declare global {
  type Keys<T> = keyof T
  type Nullable<T> = null | T
}

declare module "*.css" {}
