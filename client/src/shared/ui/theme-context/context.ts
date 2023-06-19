import { createContext } from "react"

export type Themes = 'space' | 'default' | 'dark' | 'light' | 'grey'
type ThemeType = {
    theme: Themes,
    changeTheme: (theme: Themes) => void
}
export const ThemeContext = createContext<ThemeType>({
  theme: 'space',
  changeTheme: () => ({})
})