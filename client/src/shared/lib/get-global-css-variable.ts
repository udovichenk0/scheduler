export const getGlobalCssVariable = (name: string) => {
  const rootStyles = window.getComputedStyle(document.body)
  return rootStyles.getPropertyValue("--scroll-bar-width")
}
