export function lowerCase(word: string) {
  if (!word) return ""
  return word.slice(0, 1).toLowerCase() + word.slice(1)
}
