import { RefObject, useSyncExternalStore } from "react"
let layers: RefObject<HTMLDivElement>[] = []
let listeners: (() => void)[] = []

export const layerStore = {
  push(layer: RefObject<HTMLDivElement>) {
    layers = [...layers, layer]
    emitChange()
  },
  pop() {
    layers = layers.slice(0, -1)
    emitChange()
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener]
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },
  getSnapshot() {
    return layers
  },
}

function emitChange() {
  for (let listener of listeners) {
    listener()
  }
}
export const useDisclosureLayer = () => {
  const layers = useSyncExternalStore(
    layerStore.subscribe,
    layerStore.getSnapshot,
  )

  return {
    layers,
    push: layerStore.push,
    pop: layerStore.pop,
  }
}
