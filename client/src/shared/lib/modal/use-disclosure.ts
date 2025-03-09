import { useStoreMap, useUnit } from "effector-react"
import { useEffect, useId, useState } from 'react';

import { $$modal } from '@/shared/lib/modal';

function makeId(randId: string, prefix?: string){
  if(prefix){
    return `${prefix}/${randId}`
  }
  return `modal/${randId}`
}

export const useDisclosure = ({
  id,
  prefix,
  onClose,
}:{
  id?: string
  prefix?: string
  onClose?: () => void
}) => {
  const randId = useId()
  const [modalId] = useState<string>(id || makeId(randId, prefix))
  const open = useUnit($$modal.open)
  const close = useUnit($$modal.close)
  const cancel = useUnit($$modal.cancel)
  const isOpened = useStoreMap({
    store: $$modal.$ids,
    keys: [modalId],
    fn: (ids, [id]) => ids.includes(id)
  })
  const destroy = useUnit($$modal.destroy)
  const registerOnCloseCallback = useUnit($$modal.registerOnCloseCallback)

  const openModal = () => open(modalId)

  useEffect(() => {
    if(onClose){
      registerOnCloseCallback({id: modalId, fn: onClose})
    }
    return () => {
      if(onClose){
        destroy(modalId)
      }
    }
  }, [modalId, onClose])

  return {
    open: openModal,
    close,
    cancel,
    isOpened,
  }
}