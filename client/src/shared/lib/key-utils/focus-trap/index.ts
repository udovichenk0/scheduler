let modals: HTMLElement[] = []
export function focusTrap(dialogEl: HTMLElement | null){
  if(!dialogEl) return
  modals.push(dialogEl)
  let focusableEls = findFocusableElements(dialogEl)
  const firstEl = getFirstEl(focusableEls)
  const lastEl = getLastEl(focusableEls)
  function startFocusTrap(e: FocusEvent) {
    let focusableEls = findFocusableElements(dialogEl!)
    const isActive = modals[modals.length - 1] == dialogEl
    if(!isActive) return
    if(isFirstElementUnfocused(e, firstEl)){
      tabPrev(focusableEls)
      return
    } else if(isLastElementUnfocused(e, lastEl)){
      tabNext(focusableEls)
      return
    }
    if(![...focusableEls].includes(e.target as HTMLElement)){
      getFirstEl(focusableEls)?.focus()
    }
  }
  if(focusableEls.length){
    const isCorrectFocusedElement = [...focusableEls].includes(document.activeElement as HTMLElement)
    if(!isCorrectFocusedElement){
      focusFirstElement(focusableEls)
    }
    document.addEventListener("focus", startFocusTrap, true)
  }
  return () => {
    modals.pop()
    document.removeEventListener("focus", startFocusTrap, true)
  }
}

function focusFirstElement(el: NodeListOf<Element>){
  const firstEl = el[0] as HTMLElement
  if(firstEl.focus){
    firstEl?.focus()
    return firstEl
  }
}

function tabNext(elements: NodeListOf<Element>){
  const preLastEl = elements[elements.length - 2]
  if(preLastEl !== document.activeElement){
    const firstEl = getFirstEl(elements)
    if(firstEl){
      firstEl?.focus()
    }
  }
}
function tabPrev(elements: NodeListOf<Element>){
  const secondEl = elements[1]
  if(secondEl !== document.activeElement){
    const lastEl = getLastEl(elements)
    if(lastEl){
      lastEl?.focus()
    }
  }
}

function getFirstEl(elements: NodeListOf<Element>)  {
  const firstElement = elements[0]
  if(firstElement){
    return firstElement as HTMLElement
  }
}

function getLastEl(elements: NodeListOf<Element>)  {
  const firstElement = elements[elements.length - 1]
  if(firstElement){
    return firstElement as HTMLElement
  }
}

function isFirstElementUnfocused(e: FocusEvent, firstElement: HTMLElement | undefined){
  return e.relatedTarget === firstElement
}

function isLastElementUnfocused(e: FocusEvent, lastEl: HTMLElement | undefined){
  return e.relatedTarget === lastEl
}
function findFocusableElements(elem: HTMLElement){
  return elem.querySelectorAll("a[href], button:not(:disabled), input, textarea, select, details, [tabindex]:not([tabindex='-1'])")
}