import { useUnit } from "effector-react"
import { Settings } from "@/widgets/settings"
import { Pomodoro } from "@/features/pomodoro"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Icon, IconName } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal"
import { modal, settingsModal } from "./header.model"

export const Header = ({icon, title}:{icon: IconName, title: string}) => {
  const [
    togglePomodoroModal,
    toggleSettingsModal
  ] = useUnit([
    modal.toggleTriggered,
    settingsModal.toggleTriggered
  ])
  return (
    <div className="mb-5 px-4 text-primary">
      <div className="py-2 text-end">
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
        modal={modal}>
        <Pomodoro leftSlot={
          <>
            <IconButton
              onClick={toggleSettingsModal}
              className="text-[24px] text-cIconDefault"
              iconName="common/settings" 
              intent={'primary'} 
              size={'xs'}/>
            <BaseModal className="w-[610px]" title="Settings" modal={settingsModal}>
              <Settings defaultTab="general"/>
            </BaseModal>
          </>
        }/>
      </BaseModal>
      <div className="flex gap-4 items-center">
        <Icon name={icon} className="fill-cIconDefault w-5 h-5"/>
        <h2 className="text-[24px]">{title}</h2>
      </div>
    </div>
  )
}