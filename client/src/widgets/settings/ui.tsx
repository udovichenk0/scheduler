import { PomodoroSettings } from "@/entities/settings/pomodoro"

import { ModalType } from "@/shared/lib/modal"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal"
import { Root } from "@/shared/ui/tab"

import { SynchronizationTab, GeneralTab } from "./tabs"
import { ThemeTab } from "./tabs/theme"

const tabsName = {
  general: "general" as const,
  synchronization: "synchronization" as const,
  theme: "theme" as const,
  pomodoro: "pomodoro" as const,
}
export const Settings = ({
  defaultTab = tabsName.general,
  modal,
}: {
  defaultTab: Keys<typeof tabsName>
  modal: ModalType
}) => {
  return (
    <BaseModal title="Settings" className="w-[600px]" modal={modal}>
      <Root defaultValue={defaultTab} className="text-sm">
        <Root.List className="flex gap-5 border-b-[1px] border-cBorder px-6 pb-4">
          <Root.Trigger
            value={tabsName.general}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/settings" className="h-8 w-8" />
            <span className="text-inherit">Settings</span>
          </Root.Trigger>
          <Root.Trigger
            value={tabsName.synchronization}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/cloud" className="h-8 w-8" />
            <span className="text-inherit">Synchronization</span>
          </Root.Trigger>

          <Root.Trigger
            value={tabsName.theme}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/palette" className="h-8 w-8" />
            <span className="text-inherit">Theme</span>
          </Root.Trigger>
          <Root.Trigger
            value={tabsName.pomodoro}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/timer" className="h-8 w-8" />
            <span className="text-inherit">Pomodoro</span>
          </Root.Trigger>
        </Root.List>
        <Root.Content label={tabsName.general}>
          <GeneralTab />
        </Root.Content>
        <Root.Content label={tabsName.synchronization}>
          <SynchronizationTab />
        </Root.Content>
        <Root.Content label={tabsName.theme}>
          <ThemeTab />
        </Root.Content>
        <Root.Content label={tabsName.pomodoro}>
          <PomodoroSettings />
        </Root.Content>
      </Root>
    </BaseModal>
  )
}
