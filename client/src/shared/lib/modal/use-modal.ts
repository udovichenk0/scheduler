import { $$modal } from '@/shared/lib/modal';
import { useUnit } from "effector-react"
import { useEffect, useId, useState } from 'react';

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
  const [modalId, setModalId] = useState<string>(id || makeId(randId, prefix))
  const open = useUnit($$modal.open)
  const close = useUnit($$modal.close)
  const cancel = useUnit($$modal.cancel)
  const modalIds = useUnit($$modal.$ids)
  const destroy = useUnit($$modal.destroy)
  const registerOnCloseCallback = useUnit($$modal.registerOnCloseCallback)
  const isOpened = !!modalId && modalIds.includes(modalId)

  const isOpenedWithId = (id: string) => isOpened && id == modalId
  const openModal = () => open(modalId)
  const onOpenAndSetId = (id: string) => {
    setModalId(id)
    open(id)
  }

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
    onOpenAndSetId,
    isOpened,
    isOpenedWithId: isOpenedWithId,
  }
}