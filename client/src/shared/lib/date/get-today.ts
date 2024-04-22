export const getToday = () => {
  const date = new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
