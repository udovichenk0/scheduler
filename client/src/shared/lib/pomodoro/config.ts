export const Timer = {
  START: "start",
  STOP: "stop"
} as const

export const State = {
  SHORT: "short",
  LONG: "long",
  WORK: "work",
} as const

export const defaultStgs = [
  {
    fulfilled: false,
  },
  {
    fulfilled: false,
  },
  {
    fulfilled: false,
  },
  {
    fulfilled: false,
  },
]