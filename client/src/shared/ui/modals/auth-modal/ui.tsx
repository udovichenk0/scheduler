import { Event, Store } from 'effector'
import { useUnit } from "effector-react";
interface ModalProps {
    children: any,
    modal: {
        toggleTriggered: Event<void>,
        $isOpened: Store<boolean>
    }
}
export const AuthModal = ({ children, modal }: ModalProps) => {
    const isOpened = useUnit(modal.$isOpened)
    if (!isOpened) {
        return null
    }
    return (
        <div className={'relative w-full h-screen flex items-center justify-center'}>
            <div className={'absolute bg-[#0b0417] text-white w-[610px] rounded-[5px] '}>
                <div className={'flex justify-end mr-4 mt-4'}>
                    <button onClick={() => modal.toggleTriggered()} className={'relative hover:bg-[#182137] w-[22px] h-[22px] rounded-[4px]'}>
                        <span className={'after:absolute after:content-[""] after:rotate-[45deg] after:top-[10px] after:left-[5px] after:bg-white after:w-[12px] after:h-[1px] before:absolute before:content-[""] before:rotate-[-45deg] before:top-[10px] before:left-[5px] before:bg-white before:w-[12px] before:h-[1px]'}></span>
                    </button>
                </div>
                <div className={'text-center w-[360px] mx-auto pt-4 pb-6'}>
                    {children}
                </div>
            </div>
        </div>
    )
}

// <h1 className={'text-lg'}>Welcome to Calendar</h1>
// <p className={'text-sm mt-2 mb-4'}>Log in to access your account and sync the data between devices</p>
// <Button>Continue with email</Button>