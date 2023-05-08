import { Event, Store } from 'effector'
import { useUnit } from "effector-react";
interface ModalProps {
    children: any,
    modal: {
        toggleTriggered: Event<void>,
        $isOpened: Store<boolean>
    }
}
export const BaseModal = ({ children, modal }: ModalProps) => {
    const isOpened = useUnit(modal.$isOpened)
    if (!isOpened) {
        return null
    }
    return (
        <div className='absolute w-full h-screen left-0 top-0 flex items-center justify-center bg-black/40'>
            <div className='bg-main-blue border-[1px] w-[610px] border-white/20 rounded-[5px]'>
                <div className={'flex justify-end m-2'}>
                    <button onClick={() => modal.toggleTriggered()} className={'relative hover:bg-[#182137] w-[22px] h-[22px] rounded-[4px]'}>
                        <span className={'after:absolute after:content-[""] after:rotate-[45deg] after:top-[10px] after:left-[5px] after:bg-white after:w-[12px] after:h-[1px] before:absolute before:content-[""] before:rotate-[-45deg] before:top-[10px] before:left-[5px] before:bg-white before:w-[12px] before:h-[1px]'}></span>
                    </button>
                </div>
                <div className={'mx-auto pt-4 pb-6 px-8'}>
                    {children}
                </div>
            </div>
        </div>
    )
}