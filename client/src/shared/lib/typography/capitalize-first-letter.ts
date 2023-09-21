export function capitalizeLetter(word: string) {
  return word.slice(0, 1).toUpperCase() + word.slice(1, word.length)
}
