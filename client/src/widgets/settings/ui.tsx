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
const tabs = [
  { iconName: "settings" as const, title: "General", label: tabsName.general },
  {
    iconName: "cloud" as const,
    title: "Synchronization",
    label: tabsName.synchronization,
  },
  { iconName: "palette" as const, title: "Theme", label: tabsName.theme },
  { iconName: "timer" as const, title: "Pomodoro", label: tabsName.pomodoro },
]

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
          {tabs.map(({ iconName, title, label }) => (
            <Root.Trigger
              value={label}
              key={label}
              activeClass={"text-cFont"}
              className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
            >
              <Icon name={`common/${iconName}`} className="h-8 w-8" />
              <span className="text-inherit">{title}</span>
            </Root.Trigger>
          ))}
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
