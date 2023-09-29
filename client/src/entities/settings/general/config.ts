export const languages = [
  { label: "English", value: "en" },
  { label: "Українська", value: "uk" },
]

export const languageKv = languages.reduce(
  (acc, lang) => {
    acc[lang.value] = lang.label
    return acc
  },
  {} as Record<string, string>,
)
