export interface SpritesMap {
  common:
    | "arrow"
    | "calendar"
    | "cloud"
    | "done"
    | "eye-closed"
    | "eye-opened"
    | "filled-star"
    | "inbox"
    | "mail"
    | "outlined-star"
    | "palette"
    | "plus"
    | "reset"
    | "settings"
    | "timer"
    | "upcoming"
}

export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][] } = {
  common: [
    "arrow",
    "calendar",
    "cloud",
    "done",
    "eye-closed",
    "eye-opened",
    "filled-star",
    "inbox",
    "mail",
    "outlined-star",
    "palette",
    "plus",
    "reset",
    "settings",
    "timer",
    "upcoming",
  ],
}
