import { createContext } from "react"

export const TabContext = createContext<{
  value: string
  setValue: (value: string) => void
}>({ value: "", setValue: () => ({}) })
