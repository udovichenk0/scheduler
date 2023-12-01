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
    | "note"
    | "outlined-star"
    | "palette"
    | "plus"
    | "reset"
    | "settings"
    | "timer"
    | "trash-can"
    | "upcoming"
  filter: "alph_asc" | "alph_desc" | "time_asc" | "time_desc"
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
    "note",
    "outlined-star",
    "palette",
    "plus",
    "reset",
    "settings",
    "timer",
    "trash-can",
    "upcoming",
  ],
  filter: ["alph_asc", "alph_desc", "time_asc", "time_desc"],
}
