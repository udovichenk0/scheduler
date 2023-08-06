export function parseCookieValue<T>(name: T) {
  name
  for (const cookie of document.cookie.split("; ")) {
    const [cookieName, value] = cookie.split("=")
    if (cookieName === name) {
      const isNumber = Number.isInteger(Number(value))
      if (isNumber) {
        return Number(value)
      }
      if (value === "true") {
        return true
      }
      if (value === "false") {
        return false
      }
      return value
    }
  }
}
