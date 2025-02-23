import { useEffect } from "react"
export const onMount = (cb: () => any) => {
  useEffect(() => {
    const func = cb()
    if(typeof func === "function"){
      return func
    }
  }, [])
}
