export const SortTypes = {
  ALPH_ASC: "alph_asc",
  ALPH_DESC: "alph_desc",
  TIME_ASC: "time_asc",
  TIME_DESC: "time_desc",
  DATE_CREATED_ASC: "date_created_asc",
} as const
export const Sorts = {
  DEFAULT: {
    value: SortTypes.DATE_CREATED_ASC,
    label: "sort.custom_sort",
  },
  BY_ALPHABET: {
    ASC: {
      value: SortTypes.ALPH_ASC,
      label: "sort.alph_asc",
    },
    DESC: {
      value: SortTypes.ALPH_DESC,
      label: "sort.alph_desc",
    },
  },
  BY_TIME: {
    ASC: {
      value: SortTypes.TIME_ASC,
      label: "sort.time_asc",
    },
    DESC: {
      value: SortTypes.TIME_DESC,
      label: "sort.time_desc",
    },
  },
}

export const TaskTypes = {
  //!FIX rename
  INBOX: "inbox",
  UNPLACED: "unplaced",
} as const

export const TaskStatuses = {
  //!FIX rename
  INPROGRESS: "inprogress",
  FINISHED: "finished",
} as const
