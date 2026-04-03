import { RefObject, useEffect } from "react"
import { useDisclosureLayer } from "./layer"
import { isEsc } from "@/shared/lib/key-utils"

export const useEscape = ({
  onEscape,
  modal,
}: {
  onEscape: () => void
  modal: RefObject<any>
}) => {
  const { layers } = useDisclosureLayer()
  useEffect(() => {
    const onEscDown = (e: KeyboardEvent) => {
      if (isEsc(e)) {
        if (modal.current === layers[layers.length - 1]) {
          e.stopPropagation()
          onEscape()
        }
      }
    }

    document.addEventListener("keydown", onEscDown, true)

    return () => {
      document.removeEventListener("keydown", onEscDown, true)
    }
  }, [layers])
}
