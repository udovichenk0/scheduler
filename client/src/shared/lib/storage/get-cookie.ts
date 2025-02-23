export const getCookie = (name: string) => {
  for (const cookie of document.cookie.split("; ")) {
    const [cookieName, value] = cookie.split("=")
    if (cookieName === name) {
      return value
    }
  }
}