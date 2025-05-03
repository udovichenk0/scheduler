const modals: HTMLElement[] = []
export function focusTrap(dialogEl: HTMLElement | null) {
  if (!dialogEl) return
  modals.push(dialogEl)
  const focusableEls = findFocusableElements(dialogEl)
  const firstEl = getFirstEl(focusableEls)
  const lastEl = getLastEl(focusableEls)
  function startFocusTrap(e: FocusEvent) {
    const focusableEls = findFocusableElements(dialogEl!)
    const isActive = modals[modals.length - 1] == dialogEl
    if (!isActive) return
    const target = e.target as HTMLElement

    if (isFirstElementUnfocused(e, firstEl) && !focusableEls.includes(target)) {
      tabPrev(focusableEls)
      return
    } else if (
      isLastElementUnfocused(e, lastEl) &&
      !focusableEls.includes(target)
    ) {
      tabNext(focusableEls)
      return
    }
    if (!focusableEls.includes(target)) {
      getFirstEl(focusableEls)?.focus()
    }
  }
  if (focusableEls.length) {
    const isCorrectFocusedElement = focusableEls.includes(
      document.activeElement as HTMLElement,
    )
    if (!isCorrectFocusedElement) {
      focusFirstElement(focusableEls)
    }
    document.addEventListener("focus", startFocusTrap, true)
  }
  return () => {
    modals.pop()
    document.removeEventListener("focus", startFocusTrap, true)
  }
}

function focusFirstElement(el: HTMLElement[]) {
  const firstEl = el[0] as HTMLElement
  if (firstEl.focus) {
    firstEl?.focus()
    return firstEl
  }
}

function tabNext(elements: HTMLElement[]) {
  const preLastEl = elements[elements.length - 2]
  if (preLastEl !== document.activeElement) {
    const firstEl = getFirstEl(elements)
    if (firstEl) {
      firstEl?.focus()
    }
  }
}
function tabPrev(elements: HTMLElement[]) {
  const secondEl = elements[1]
  if (secondEl !== document.activeElement) {
    const lastEl = getLastEl(elements)
    if (lastEl) {
      lastEl?.focus()
    }
  }
}

function getFirstEl(elements: HTMLElement[]) {
  const firstElement = elements[0]
  if (firstElement) {
    return firstElement
  }
}

function getLastEl(elements: HTMLElement[]) {
  const firstElement = elements[elements.length - 1]
  if (firstElement) {
    return firstElement
  }
}

function isFirstElementUnfocused(
  e: FocusEvent,
  firstElement: HTMLElement | undefined,
) {
  return e.relatedTarget === firstElement
}

function isLastElementUnfocused(
  e: FocusEvent,
  lastEl: HTMLElement | undefined,
) {
  return e.relatedTarget === lastEl
}
function findFocusableElements(elem: HTMLElement) {
  return [
    ...elem.querySelectorAll(
      "a[href], button:not(:disabled), input, textarea, select, details, [tabindex]:not([tabindex='-1'])",
    ),
  ] as HTMLElement[]
}
