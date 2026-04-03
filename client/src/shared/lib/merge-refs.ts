import { RefObject } from "react"

export function mergeRefs<T>(refs: RefObject<Nullable<T>>[]) {
  return (node: T) => {
    refs.forEach((ref) => {
      ref.current = node
    })
    return () => {
      refs.forEach((ref) => {
        ref.current = null
      })
    }
  }
}
