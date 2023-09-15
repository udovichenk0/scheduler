export default {
  name: "customPath",

  lookup() {
    let found
    if (typeof window !== "undefined") {
      const language = window.location.pathname.match(/\/([a-zA-Z-]*)/g)
      if (language instanceof Array && language.length) {
        found = language[language.length - 1].replace("/", "")
      }
    }
    return found
  },
}
