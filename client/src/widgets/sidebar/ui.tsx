import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/widgets/settings"

import { Icon } from "@/shared/ui/icon/icon"
import { routes } from "@/shared/routing"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Container } from "@/shared/ui/general/container"

import {
  $inboxTasksCount,
  $todayTasksCount,
  $$modal,
  navigate,
} from "./sidebar.modal"
import { Logo } from "./ui/logo"
import { SideLink } from "./ui/side-link"

export const Sidebar = () => {
  const { t } = useTranslation()
  const [inboxTasksCount, todayTasksCount, openSettingsModal] = useUnit([
    $inboxTasksCount,
    $todayTasksCount,
    $$modal.open,
  ])
  return (
    <aside className={`border-r-[1px] border-cBorder bg-brand text-primary`}>
      <div className="grid h-full w-[250px] grid-rows-[auto_1fr_auto] flex-col">
        <Container className="border-b-[1px] border-cBorder">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Logo />
              <h2 className="text-sm font-semibold">Timequanta app</h2>
            </div>
            <div>... {/* make a popup*/}</div>
          </div>
          <div className="space-y-2">
            <SideLink
              route={routes.inbox}
              title={t("task.inbox")}
              rightCount={inboxTasksCount}
              iconName="common/inbox"
            />
            <SideLink
              route={routes.home}
              title={t("task.today")}
              rightCount={todayTasksCount}
              iconName="common/outlined-star"
            />
            <SideLink
              route={routes.upcoming}
              title={t("task.upcoming")}
              iconName="common/upcoming"
            />
            <SideLink
              route={routes.calendar}
              title={t("task.calendar")}
              iconName="common/calendar"
            />
          </div>
        </Container>
        <Container>
          <Button size={"sm"} className="w-full text-start" intent={"primary"}>
            <Icon name="common/plus" className="mr-4 text-cOpacitySecondFont" />
            <span className="text-[12px] text-primary">
              {t("sidebar.project")}
            </span>
          </Button>
        </Container>

        <Container className="flex gap-2 border-t-[1px] border-cBorder text-cIconDefault">
          <Button
            title="Settings"
            onClick={openSettingsModal}
            intent={"primary"}
            size={"xs"}
          >
            <Icon name="common/settings" className="text-[24px]" />
          </Button>
          <Button
            title="Unplaced"
            onClick={() => navigate(routes.unplaced)}
            intent={"primary"}
            size={"xs"}
          >
            <Icon name="common/cross-arrows" className="text-[24px]" />
          </Button>

          <Settings modal={$$modal} defaultTab="general" />
        </Container>
      </div>
    </aside>
  )
}
