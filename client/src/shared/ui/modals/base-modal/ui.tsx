import { Event, Store } from 'effector'
import { useUnit } from "effector-react";
import { ReactNode } from 'react'
import { createPortal } from 'react-dom';
interface ModalProps {
    children: ReactNode,
    modal: {
        toggleTriggered: Event<void>,
        $isOpened: Store<boolean>
    }
}

//TODO make props like width modal etc. to make it reusable
//TODO move layout to app.tsx
export const BaseModal = ({ children, modal }: ModalProps) => {
  const isOpened = useUnit(modal.$isOpened)
  if (!isOpened) {
    return null
  }
  return (
    createPortal(<div className='absolute w-full text-white h-screen left-0 top-0 flex items-center justify-center bg-black/40'>
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