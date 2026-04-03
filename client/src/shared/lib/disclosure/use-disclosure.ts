import { useStoreMap, useUnit } from "effector-react"
import { useCallback, useId, useState } from "react"

import { $$modal } from "@/shared/lib/disclosure"

function makeId(randId: string, prefix?: string) {
  if (prefix) {
    return `${prefix}/${randId}`
  }
  return `modal/${randId}`
}

export const useDisclosure = ({
  id,
  prefix,
  onClose,
  onOpen,
  onCancel,
  onUnmount,
}: {
  id?: string
  prefix?: string
  onClose?: () => void
  onOpen?: () => void
  onCancel?: () => void
  onUnmount?: () => void
}) => {
  const randId = useId()
  const [modalId] = useState<string>(id || makeId(randId, prefix))
  const open = useUnit($$modal.open)
  const close = useUnit($$modal.close)
  const isOpened = useStoreMap({
    store: $$modal.$ids,
    keys: [modalId],
    fn: (ids, [id]) => ids.includes(id),
  })

  const openModal = useCallback(() => {
    onOpen?.()
    open(modalId)
  }, [onOpen])

  const closeModal = useCallback(() => {
    close()
    onUnmount?.()
    onClose?.()
  }, [onUnmount, onClose])
  const cancel = useCallback(() => {
    close()
    onUnmount?.()
    onCancel?.()
  }, [onUnmount, onCancel])

  return {
    open: openModal,
    close: closeModal,
    cancel,
    isOpened,
  }
}

export type Disclosure = ReturnType<typeof useDisclosure>
