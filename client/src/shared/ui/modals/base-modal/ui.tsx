import { useUnit } from "effector-react";
import { MouseEvent, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom';
import { ModalType } from '@/shared/lib/modal';
interface ModalProps {
    children: ReactNode,
    modal: ModalType
}

export const BaseModal = ({ children, modal }: ModalProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isOpened = useUnit(modal.$isOpened)
  if (!isOpened) {
    return null
  }

  const handleOnClickOutside = (e: MouseEvent) => {
    if(e.target === ref.current) {
      modal.clickOutsideTriggered()
    }
  }

  return (
    createPortal(
    <div
    ref={ref}
    onClick={handleOnClickOutside}
    className='absolute w-full text-white h-screen left-0 top-0 flex items-center justify-center bg-black/40'>
      <div className='bg-main drop-shadow-[0_35px_35px_rgba(0,0,0,.56)] border-[1px] w-[610px] border-cBorder rounded-[5px]'>
        <div className={'flex justify-end m-2'}>
          <button onClick={() => modal.toggleTriggered()} className={'relative hover:bg-cHover w-[22px] h-[22px] rounded-[4px]'}>
            <span className={'after:absolute after:content-[""] after:rotate-[45deg] after:top-[10px] after:left-[5px] after:bg-cFont after:w-[12px] after:h-[1px] before:absolute before:content-[""] before:rotate-[-45deg] before:top-[10px] before:left-[5px] before:bg-cFont before:w-[12px] before:h-[1px]'}></span>
          </button>
        </div>
        <div className={'mx-auto pt-1 pb-6'}>
          {children}
        </div>
      </div>
    </div>,
    document.body)
  )
}