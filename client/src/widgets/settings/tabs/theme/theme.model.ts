import { createEvent, createStore, sample, createEffect } from "effector";
import { createGate } from 'effector-react'
import Cookies from 'universal-cookie';
type Theme = 'space' | 'default' | 'dark' | 'light' | 'grey'
type Accent = 'blue' | 'yellow' | 'green' | 'red' | 'orange' | 'purple' | 'pink'
export const themeChanged = createEvent<Theme>()
export const accentChanged = createEvent<Accent>()
export const cookies = new Cookies()

export const $theme = createStore<Theme | null>(null)
export const $accent = createStore<Accent | null>(null)

export const themeGate = createGate() 

const changeThemeFx = createEffect((theme: Theme) => {
  cookies.set('theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
})

//TODO everything move to entity probly
const changeAccentFx = createEffect((accent: Accent) => {
  cookies.set('accent', accent)
  document.documentElement.style.setProperty('--accent', `var(--${accent})`)
})

const getThemeFx = createEffect(() => {
  const theme = cookies.get('theme') as Theme || 'space'
  return theme
})
const getAccentFx = createEffect(() => {
  const accent = cookies.get('accent') as Accent || 'blue'
  return accent
})

sample({
  clock: themeGate.open,
  target: [getThemeFx, getAccentFx]
})
sample({
  clock: getThemeFx.doneData,
  target: $theme
})
sample({
  clock: getAccentFx.doneData,
  target: $accent
})

sample({
  clock: themeChanged,
  target: changeThemeFx 
})

sample({
  clock: accentChanged,
  target: changeAccentFx 
})

sample({
  clock: changeThemeFx.done,
  fn: ({params}) => params,
  target: $theme
})
sample({
  clock: changeAccentFx.done,
  fn: ({params}) => params,
  target: $accent
})
// use effector-storage


