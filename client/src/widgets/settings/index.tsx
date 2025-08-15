import { useTranslation } from "react-i18next"
import { useRef, useState } from "react"

import { PomodoroSettings } from "@/entities/settings/pomodoro/ui.tsx"
import { ThemeChanger } from "@/entities/settings/theme/ui.tsx"
import { GeneralSettings } from "@/entities/settings/general/general.tsx"

import { Icon } from "@/shared/ui/icon"
import { Tabs } from "@/shared/ui/tab"
import { Modal } from "@/shared/ui/modal"
import { Button } from "@/shared/ui/buttons/main-button/index.tsx"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure.ts"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names.ts"

import { Authentication } from "./ui/sync/sync.tsx"
const Tab = {
  general: "general",
  synchronization: "synchronization",
  theme: "theme",
  pomodoro: "pomodoro",
} as const
const Settings = ({
  defaultTab = Tab.general,
}: {
  defaultTab?: Keys<typeof Tab>
}) => {
  const {
    isOpened: isSettingsOpened,
    open: onOpenSettings,
    close: onCloseSettings,
  } = useDisclosure({ prefix: ModalName.SidebarSettingsModal })
  const { t } = useTranslation()
  const [tab, setTab] = useState<string>(defaultTab)

  return (
    <Modal
      label={t("setting.title")}
      closeModal={onCloseSettings}
      isOpened={isSettingsOpened}
    >
      <Button
        title={t("setting.title")}
        onClick={onOpenSettings}
        intent="primary"
        size="xs"
      >
        <Icon name="common/settings" className="text-[24px]" />
      </Button>
      <Modal.Content className="w-[600px]">
        <Modal.Header>
          <Modal.Title>{t("setting.title")}</Modal.Title>
          <Modal.CloseButton close={onCloseSettings} />
        </Modal.Header>
        <Tabs
          contentStyles="px-6 py-4"
          value={tab}
          onChange={setTab}
          className="text-sm"
        >
          <Tabs.List className="border-cBorder flex gap-5 border-b-[1px] px-6 pb-4">
            <Tabs.Trigger
              value={Tab.general}
              activeClass={"text-cFont"}
              className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
            >
              <Icon name="common/settings" className="h-8 w-8" />
              <span className="text-inherit">{t("setting.tab.general")}</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value={Tab.synchronization}
              activeClass={"text-cFont"}
              className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
            >
              <Icon name="common/cloud" className="h-8 w-8" />
              <span className="text-inherit">
                {t("setting.tab.synchronization")}
              </span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value={Tab.theme}
              activeClass={"text-cFont"}
              className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
            >
              <Icon name="common/palette" className="h-8 w-8" />
              <span className="text-inherit">{t("setting.tab.theme")}</span>
            </Tabs.Trigger>
            <Tabs.Trigger
              value={Tab.pomodoro}
              activeClass={"text-cFont"}
              className={`hover:text-primary flex flex-col items-center gap-3 text-[#76899b]`}
            >
              <Icon name="common/timer" className="h-8 w-8" />
              <span className="text-inherit">{t("setting.tab.pomodoro")}</span>
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content label={Tab.general}>
            <GeneralSettings />
          </Tabs.Content>
          <Tabs.Content label={Tab.synchronization}>
            <Authentication />
          </Tabs.Content>
          <Tabs.Content label={Tab.theme}>
            <ThemeChanger />
          </Tabs.Content>
          <Tabs.Content label={Tab.pomodoro}>
            <PomodoroSettings />
          </Tabs.Content>
        </Tabs>
      </Modal.Content>
    </Modal>
  )
}

export default Settings
