/// <reference types="vite/client" />

declare global {
  type Keys<T> = keyof T
  type Nullable<T> = null | T
}
declare const MODE: string