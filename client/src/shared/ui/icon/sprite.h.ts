export interface SpritesMap {
  common:
    | "arrow"
    | "calendar-due-date"
    | "calendar-start-date"
    | "calendar"
    | "cloud"
    | "cross-arrows"
    | "done"
    | "eye-closed"
    | "eye-opened"
    | "filled-star"
    | "inbox"
    | "mail"
    | "note"
    | "outlined-star"
    | "palette"
    | "plus"
    | "reset"
    | "settings"
    | "timer"
    | "trash-can"
    | "upcoming"
  sort: "alph_asc" | "alph_desc" | "date_created_asc" | "time_asc" | "time_desc"
}
export const SPRITES_META: {
  [Key in keyof SpritesMap]: {
    filePath: string
    items: Record<
      SpritesMap[Key],
      {
        viewBox: string
        width: number
        height: number
      }
    >
  }
} = {
  common: {
    filePath: "common.svg",
    items: {
      arrow: {
        viewBox: "0 0 1024 1024",
        width: 512,
        height: 512,
      },
      "calendar-due-date": {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      "calendar-start-date": {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      calendar: {
        viewBox: "0 0 16 16",
        width: 20,
        height: 20,
      },
      cloud: {
        viewBox: "0 0 317.17 317.17",
        width: 317.17,
        height: 317.17,
      },
      "cross-arrows": {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      done: {
        viewBox: "0 0 122.877 101.052",
        width: 122.877,
        height: 101.052,
      },
      "eye-closed": {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      "eye-opened": {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      "filled-star": {
        viewBox: "0 0 473.486 473.486",
        width: 473.486,
        height: 473.486,
      },
      inbox: {
        viewBox: "0 0 512 512",
        width: 20,
        height: 20,
      },
      mail: {
        viewBox: "0 0 122.88 88.86",
        width: 122.88,
        height: 88.86,
      },
      note: {
        viewBox: "0 0 256 256",
        width: 512,
        height: 512,
      },
      "outlined-star": {
        viewBox: "0 -0.5 21 21",
        width: 20,
        height: 20,
      },
      palette: {
        viewBox: "0 0 496 496",
        width: 496,
        height: 496,
      },
      plus: {
        viewBox: "0 0 24 24",
        width: 18,
        height: 18,
      },
      reset: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      settings: {
        viewBox: "0 0 16 16",
        width: 16,
        height: 16,
      },
      timer: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      "trash-can": {
        viewBox: "0 0 32 32",
        width: 512,
        height: 512,
      },
      upcoming: {
        viewBox: "0 0 361.77 361.77",
        width: 361.77,
        height: 361.77,
      },
    },
  },
  sort: {
    filePath: "sort.svg",
    items: {
      alph_asc: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      alph_desc: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      date_created_asc: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      time_asc: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
      time_desc: {
        viewBox: "0 0 24 24",
        width: 24,
        height: 24,
      },
    },
  },
}
