import { PropsWithChildren, useState } from "react"
import { ThemeContext, Themes } from "@/shared/ui/theme-context"

export const ThemeProvider = ({children}:PropsWithChildren) => {
  const [currentTheme, changeTheme] = useState<Themes>('space')
  return (
    <ThemeContext.Provider value={{
      theme: currentTheme,
      changeTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}