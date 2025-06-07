import { useStoreMap, useUnit } from "effector-react"
import { useId, useState } from "react"

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
}: {
  id?: string
  prefix?: string
  onClose?: () => void
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

  const openModal = () => open(modalId)

  const closeModal = () => {
    close()
    onClose?.()
  }
  const cancel = () => {
    close()
  }

  return {
    open: openModal,
    close: closeModal,
    cancel,
    isOpened,
  }
}
