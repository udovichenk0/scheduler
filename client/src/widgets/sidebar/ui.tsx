import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Settings } from "@/widgets/settings"

import { Icon } from "@/shared/ui/icon/icon"
import { routes } from "@/shared/routing"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Container } from "@/shared/ui/general/container"

import { $inboxTasksCount, $todayTasksCount, $$modal } from "./sidebar.modal"
import { Logo } from "./ui/logo"
import { SidebarFooter } from "./ui/footer"

export const Sidebar = () => {
  const { t } = useTranslation()
  const inboxTasksCount = useUnit($inboxTasksCount)
  const todayTasksCount = useUnit($todayTasksCount)
  const openSettingsModal = useUnit($$modal.open)
  const sidebar_footer_buttons = [
    {title: "setting.title", onClick: openSettingsModal, type: 'button' as const, iconName: "common/settings" as const},
    {title: "task.unplaced", type: 'link' as const, route: routes.unplaced, iconName: "common/cross-arrows" as const},
    {title: "task.trash", type: 'link' as const, route: routes.trash, iconName: "common/trash-can" as const},
  ]
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
            <Button
              activeClassName="bg-cFocus"
              as="link"
              to={routes.inbox}
              intent={"primary"}
              className="flex w-full items-center justify-between"
              size={"sm"}
            >
              <div className="flex items-center justify-center">
                <Icon
                  name={"common/inbox"}
                  className="mr-4 fill-accent text-[20px]"
                />
                {t("task.inbox")}
              </div>
              <span className="text-grey">{inboxTasksCount}</span>
            </Button>

            <Button
              activeClassName="bg-cFocus"
              as="link"
              to={routes.home}
              intent={"primary"}
              className="flex w-full items-center justify-between"
              size={"sm"}
            >
              <div className="flex items-center justify-center">
                <Icon
                  name={"common/outlined-star"}
                  className="mr-4 fill-accent text-[20px]"
                />
                {t("task.today")}
              </div>
              <span className="text-grey">{todayTasksCount}</span>
            </Button>

            <Button
              activeClassName="bg-cFocus"
              as="link"
              to={routes.upcoming}
              intent={"primary"}
              className="flex w-full items-center"
              size={"sm"}
            >
              <Icon
                name={"common/upcoming"}
                className="mr-4 fill-accent text-[20px]"
              />
              {t("task.upcoming")}
            </Button>

            <Button
              activeClassName="bg-cFocus"
              as="link"
              to={routes.calendar}
              intent={"primary"}
              className="flex w-full items-center"
              size={"sm"}
            >
              <Icon
                name={"common/calendar"}
                className="mr-4 fill-accent text-[20px]"
              />
              {t("task.calendar")}
            </Button>
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
        
        <SidebarFooter config={sidebar_footer_buttons}/>

        <Settings modal={$$modal} defaultTab="general" />
      </div>
    </aside>
  )
}
