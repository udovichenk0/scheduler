import { createEvent, createStore, sample, createEffect } from "effector";
import { createGate } from 'effector-react'
import Cookies from 'universal-cookie';
type Theme = 'space' | 'default' | 'dark' | 'light' | 'grey'
export const themeChanged = createEvent<Theme>()
export const cookies = new Cookies()
export const $theme = createStore<Theme | null>(null)
const changeThemeFx = createEffect((theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  cookies.set('theme', theme)
})
export const themeGate = createGate() 

sample({
  clock: themeGate.open,
  fn: () => cookies.get('theme'),
  target: changeThemeFx
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
// use effector-storage


