import { useEffect, useRef, useState } from "react"

export const useSelectItem = <T,>({
  items,
  onChange,
}: {
  items: T[]
  onChange?: (value: Nullable<T>) => void
}) => {
  const [selectedItem, setSelectedItem] = useState<Nullable<number>>(null)
  const refItems = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (items.length < refItems.current.length) {
      if (selectedItem != null && selectedItem >= 0) {
        if (items[selectedItem]) {
          refItems.current[selectedItem].focus()
          onChange?.(items[selectedItem])
        } else if (items[selectedItem - 1]) {
          setSelectedItem(selectedItem - 1)
          onChange?.(items[selectedItem - 1])
          refItems.current[selectedItem - 1].focus()
        }
        refItems.current = refItems.current.filter(
          (_, id) => id !== selectedItem,
        )
      }
    }
  }, [items, selectedItem])
  const select = (index: number) => {
    const item = items[index]
    if (item && onChange) {
      onChange(item)
    }
    setSelectedItem(index)
  }

  const unselect = (node: Element) => {
    if (!node) {
      setSelectedItem(null)
      onChange?.(null)
    }
  }

  const addNode = (node: HTMLDivElement, index: number) => {
    refItems.current[index] = node
  }

  return {
    onSelect: select,
    onUnselect: unselect,
    selectedItem,
    addNode,
  }
}
