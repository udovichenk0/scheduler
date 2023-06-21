import { createEvent, createStore, sample } from "effector";
import { createEffect } from "effector/compat";
import Cookies from 'universal-cookie';
type Theme = 'space' | 'default' | 'dark' | 'light' | 'grey'
export const themeChanged = createEvent<Theme>()
export const cookies = new Cookies()
export const $theme = createStore<Theme | null>(null)
const changeThemeFx = createEffect((theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  cookies.set('theme', theme)
})
sample({
  clock: themeChanged,
  target: changeThemeFx 
})

sample({
  clock: changeThemeFx.done,
  fn: ({params}) => params,
  target: $theme
})


