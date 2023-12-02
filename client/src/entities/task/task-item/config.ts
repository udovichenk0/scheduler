export const SortTypes = {
  ALPH_ASC: "alph_asc",
  ALPH_DESC: "alph_desc",
  TIME_ASC: "time_asc",
  TIME_DESC: "time_desc",
  DATE_CREATED_ASC: 'date_created_asc',
} as const
export const Sorts = {
  DEFAULT: {
    value: SortTypes.DATE_CREATED_ASC,
    label: "Custom sorting",
  },
  BY_ALPHABET: {
    ASC: {
      value: SortTypes.ALPH_ASC,
      label: "By alphabet(asc)",
    },
    DESC: {
      value: SortTypes.ALPH_DESC,
      label: "By alphabet(desc)",
    },
  },
  BY_TIME: {
    ASC: {
      value: SortTypes.TIME_ASC,
      label: "By time(asc)",
    },
    DESC: {
      value: SortTypes.TIME_DESC,
      label: "By time(desc)",
    }
  }
}

export const TaskTypes  = {
  INBOX: 'inbox',
  UNPLACED: 'unplaced',
} as const

export const TaskStatuses = {
  INPROGRESS: 'INPROGRESS',
  FINISHED: 'FINISHED',
} as const