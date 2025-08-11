export interface SpritesMap {
  common:
    | "arrow-right"
    | "arrow"
    | "calendar-due-date"
    | "calendar-start-date"
    | "calendar"
    | "cancel"
    | "cloud"
    | "cross-arrows"
    | "done"
    | "eye-closed"
    | "eye-opened"
    | "filled-star"
    | "flag"
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
    | "x"
  sort: "alph_asc" | "alph_desc" | "date_created_asc" | "time_asc" | "time_desc"
}
export const SPRITES_META: {
  common: Array<
    | "arrow-right"
    | "arrow"
    | "calendar-due-date"
    | "calendar-start-date"
    | "calendar"
    | "cancel"
    | "cloud"
    | "cross-arrows"
    | "done"
    | "eye-closed"
    | "eye-opened"
    | "filled-star"
    | "flag"
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
    | "x"
  >
  sort: Array<
    "alph_asc" | "alph_desc" | "date_created_asc" | "time_asc" | "time_desc"
  >
} = {
  common: [
    "arrow-right",
    "arrow",
    "calendar-due-date",
    "calendar-start-date",
    "calendar",
    "cancel",
    "cloud",
    "cross-arrows",
    "done",
    "eye-closed",
    "eye-opened",
    "filled-star",
    "flag",
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
    "x",
  ],
  sort: ["alph_asc", "alph_desc", "date_created_asc", "time_asc", "time_desc"],
}
