import { KeyboardEvent as KeyboardEventReact } from "react"

const Key = {
  enter: "Enter",
  space: "Space",
  esc: "Escape"
} as const

export const isEnter = (e: KeyboardEventReact | KeyboardEvent) => e.key === Key.enter
export const isEsc = (e: KeyboardEventReact | KeyboardEvent) => e.key === Key.esc
export const isSpace = (e: KeyboardEventReact | KeyboardEvent) => e.key === Key.space
