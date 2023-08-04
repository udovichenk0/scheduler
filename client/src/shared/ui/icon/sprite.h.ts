export interface SpritesMap {
  common:
    | "arrow"
    | "calendar"
    | "cloud"
    | "cross-arrows"
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
    | "trash-can"
    | "upcoming"
}

export const SPRITES_META: { [K in keyof SpritesMap]: SpritesMap[K][] } = {
  common: [
    "arrow",
    "calendar",
    "cloud",
    "cross-arrows",
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
    "trash-can",
    "upcoming",
  ],
}
