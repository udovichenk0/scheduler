import { useTranslation } from "react-i18next"

import { PomodoroSettings } from "@/entities/settings/pomodoro"
import { ThemeChanger } from "@/entities/settings/theme"
import { GeneralSettings } from "@/entities/settings/general"

import { ModalType } from "@/shared/lib/modal"
import { Icon } from "@/shared/ui/icon"
import { MainModal } from "@/shared/ui/modals/main"
import { Root } from "@/shared/ui/tab"

import { Authentication } from "./ui/sync"
const tabsName = {
  general: "general",
  synchronization: "synchronization",
  theme: "theme",
  pomodoro: "pomodoro",
} as const
export const Settings = ({
  defaultTab = tabsName.general,
  modal,
}: {
  defaultTab: Keys<typeof tabsName>
  modal: ModalType
}) => {
  const { t } = useTranslation()
  return (
    <MainModal
      title={t("setting.title")}
      className="w-[600px]"
      modal={modal}
    >
      <Root defaultValue={defaultTab} className="text-sm">
        <Root.List className="flex gap-5 border-b-[1px] border-cBorder px-6 pb-4">
          <Root.Trigger
            value={tabsName.general}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/settings" className="h-8 w-8" />
            <span className="text-inherit">{t("setting.tab.general")}</span>
          </Root.Trigger>
          <Root.Trigger
            value={tabsName.synchronization}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/cloud" className="h-8 w-8" />
            <span className="text-inherit">
              {t("setting.tab.synchronization")}
            </span>
          </Root.Trigger>

          <Root.Trigger
            value={tabsName.theme}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/palette" className="h-8 w-8" />
            <span className="text-inherit">{t("setting.tab.theme")}</span>
          </Root.Trigger>
          <Root.Trigger
            value={tabsName.pomodoro}
            activeClass={"text-cFont"}
            className={`flex flex-col items-center gap-3 text-[#76899b] hover:text-primary`}
          >
            <Icon name="common/timer" className="h-8 w-8" />
            <span className="text-inherit">{t("setting.tab.pomodoro")}</span>
          </Root.Trigger>
        </Root.List>
        <Root.Content label={tabsName.general}>
          <GeneralSettings />
        </Root.Content>
        <Root.Content label={tabsName.synchronization}>
          <Authentication />
        </Root.Content>
        <Root.Content label={tabsName.theme}>
          <ThemeChanger />
        </Root.Content>
        <Root.Content label={tabsName.pomodoro}>
          <PomodoroSettings />
        </Root.Content>
      </Root>
    </MainModal>
  )
}
