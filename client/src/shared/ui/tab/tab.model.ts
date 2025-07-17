import { createContext } from "react"

export const TabContext = createContext<{
  value: string
  setValue: (value: any) => void
}>({ value: "", setValue: () => ({}) })
