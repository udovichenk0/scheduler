import { useEffect } from "react"

let count = 0

function createFocusGuard() {
  const element = document.createElement("span")
  element.setAttribute("data-modal-guard", "")
  element.tabIndex = 0
  element.style.outline = "none"
  element.style.opacity = "0"
  element.style.position = "fixed"
  element.style.pointerEvents = "none"
  return element
}

export function useFocusGuards() {
  useEffect(() => {
    const edgeGuards = document.querySelectorAll("[data-modal-guard]")
    document.body.insertAdjacentElement(
      "afterbegin",
      edgeGuards[0] ?? createFocusGuard(),
    )
    document.body.insertAdjacentElement(
      "beforeend",
      edgeGuards[1] ?? createFocusGuard(),
    )
    count++

    return () => {
      if (count === 1) {
        document
          .querySelectorAll("[data-modal-guard]")
          .forEach((node) => node.remove())
      }
      count--
    }
  }, [])
}
