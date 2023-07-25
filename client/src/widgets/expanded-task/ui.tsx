import { clsx } from "clsx";
import { useUnit } from "effector-react/effector-react.mjs";
import { ReactNode, RefObject } from "react"
import { Pomodoro } from "@/features/pomodoro";
import { IconButton } from "@/shared/ui/buttons/icon-button";
import { BaseModal } from "@/shared/ui/modals/base-modal";
import { Settings } from "../settings";
import { pomodoroModal, settingsModal } from "./model";

export const ExpandedTask = ({
  taskRef, 
  className, 
  children
}: {
  taskRef: RefObject<HTMLDivElement>,
  className?: string,
  children: ReactNode
}) => {
  const [
    togglePomodoroModal,
    toggleSettingsModal
  ] = useUnit([
    pomodoroModal.toggleTriggered,
    settingsModal.toggleTriggered
  ])
  return (
    <div ref={taskRef} className={clsx("flex px-2 py-2 flex-col w-full bg-cTaskEdit rounded-[5px] text-sm", className)}>
      <div className="w-full">
        {children}
      </div>
      <div className="text-end">
        <IconButton
          className="text-[24px] text-cIconDefault" 
          iconName="common/timer" 
          intent={'primary'}
          size={'xs'}
          onClick={togglePomodoroModal}/>
      </div>
      <BaseModal
        className="w-[320px]" 
        title="Pomodoro"
        modal={pomodoroModal}>
        <Pomodoro leftSlot={
          <>
            <IconButton
              onClick={toggleSettingsModal}
              className="text-[24px] text-cIconDefault"
              iconName="common/settings" 
              intent={'primary'} 
              size={'xs'}/>
            <BaseModal className="w-[610px]" title="Settings" modal={settingsModal}>
              <Settings defaultTab="theme"/>
            </BaseModal>
          </>
        }/>
      </BaseModal>
    </div>
  )
}
