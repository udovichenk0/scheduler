import { createEvent, createStore, sample, createEffect } from "effector";
import { createGate } from 'effector-react'
import Cookies from 'universal-cookie';
type Theme = 'space' | 'default' | 'dark' | 'light' | 'grey'
export const themeChanged = createEvent<Theme>()
export const cookies = new Cookies()

export const $theme = createStore<Theme | null>(null)

const changeThemeFx = createEffect((theme: Theme) => {
  cookies.set('theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
})
const getThemeFx = createEffect(() => {
  const theme = cookies.get('theme') as Theme || 'space'
  return theme
})

export const themeGate = createGate() 

sample({
  clock: themeGate.open,
  target: getThemeFx
})
sample({
  clock: getThemeFx.doneData,
  target: $theme
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


