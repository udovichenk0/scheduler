import { useTranslation } from "react-i18next"
import { useRef, useState } from "react"

import { PomodoroSettings } from "@/entities/settings/pomodoro"
import { ThemeChanger } from "@/entities/settings/theme"
import { GeneralSettings } from "@/entities/settings/general"

import { Icon } from "@/shared/ui/icon"
import { Root } from "@/shared/ui/tab"
import { CloseButton, Modal } from "@/shared/ui/modal"

import { Authentication } from "./ui/sync"
const Tab = {
  general: "general",
  synchronization: "synchronization",
  theme: "theme",
  pomodoro: "pomodoro",
} as const
const Settings = ({
  defaultTab = Tab.general,
  onClose: onCloseSettings,
  isOpen: isSettingsOpened,
}: {
  defaultTab?: Keys<typeof Tab>
  onClose: () => void
  isOpen: boolean
}) => {
  const { t } = useTranslation()
  const ref = useRef<HTMLButtonElement>(null)
  const [tab, setTab] = useState<string>(defaultTab)

  return (
    <Modal
      label={t("setting.title")}
      closeModal={onCloseSettings}
      isOpened={isSettingsOpened}
    >
      <Modal.Overlay>
        <Modal.Body className="w-[600px]">
          <Modal.Header>
            <span className="w-full pl-6 text-center text-[12px]">
              {t("setting.title")}
            </span>
            <CloseButton close={onCloseSettings} />
          </Modal.Header>
          <Modal.Content initialFocus={ref}>
            <Root value={tab} onChange={setTab} className="text-sm">
              <Root.List className="border-cBorder flex gap-5 border-b-[1px] px-6 pb-4">
                <Root.Trigger
                  value={Tab.general}
                  activeClass={"text-cFont"}
                  className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
                >
                  <Icon name="common/settings" className="h-8 w-8" />
                  <span className="text-inherit">
                    {t("setting.tab.general")}
                  </span>
                </Root.Trigger>
                <Root.Trigger
                  value={Tab.synchronization}
                  activeClass={"text-cFont"}
                  className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
                >
                  <Icon name="common/cloud" className="h-8 w-8" />
                  <span className="text-inherit">
                    {t("setting.tab.synchronization")}
                  </span>
                </Root.Trigger>
                <Root.Trigger
                  value={Tab.theme}
                  activeClass={"text-cFont"}
                  className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
                >
                  <Icon name="common/palette" className="h-8 w-8" />
                  <span className="text-inherit">{t("setting.tab.theme")}</span>
                </Root.Trigger>
                <Root.Trigger
                  value={Tab.pomodoro}
                  activeClass={"text-cFont"}
                  className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
                >
                  <Icon name="common/timer" className="h-8 w-8" />
                  <span className="text-inherit">
                    {t("setting.tab.pomodoro")}
                  </span>
                </Root.Trigger>
              </Root.List>
              <Root.Content label={Tab.general}>
                <GeneralSettings />
              </Root.Content>
              <Root.Content label={Tab.synchronization}>
                <Authentication />
              </Root.Content>
              <Root.Content label={Tab.theme}>
                <ThemeChanger />
              </Root.Content>
              <Root.Content label={Tab.pomodoro}>
                <PomodoroSettings />
              </Root.Content>
            </Root>
          </Modal.Content>
        </Modal.Body>
      </Modal.Overlay>
    </Modal>
  )
}

export default Settings
