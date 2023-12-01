export const SortingTypes = {
  ALPH_ASC: "alph_asc",
  ALPH_DESC: "alph_desc",
  TIME_ASC: "time_asc",
  TIME_DESC: "time_desc",
} as const
export const Filters = {
  BY_ALPHABET: {
    ASC: {
      value: SortingTypes.ALPH_ASC,
      label: "By alphabet(desc)",
    },
    DESC: {
      value: SortingTypes.ALPH_DESC,
      label: "By alphabet(asc)",
    },
  },
  BY_TIME: {
    ASC: {
      value: SortingTypes.TIME_ASC,
      label: "By time(asc)",
    },
    DESC: {
      value: SortingTypes.TIME_DESC,
      label: "By time(desc)",
    }
  }
}
