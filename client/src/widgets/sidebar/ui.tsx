import { useUnit } from "effector-react"
import { useTranslation } from "react-i18next"

import { Icon } from "@/shared/ui/icon"
import { routes } from "@/shared/routing/router.ts"
import { Button } from "@/shared/ui/buttons/main-button"
import { Container } from "@/shared/ui/general/container"
import { Tooltip } from "@/shared/ui/general/tooltip"

import Settings from "../settings"

import { Logo } from "./logo"
import { $inboxCounter, $todayCounter } from "./sidebar.model"

export const Sidebar = () => {
  const { t } = useTranslation()
  const inboxTasksCount = useUnit($inboxCounter)
  const todayTasksCount = useUnit($todayCounter)

  return (
    <aside className={`border-cBorder bg-brand text-primary border-r-[1px]`}>
      <div className="grid h-full w-[250px] grid-rows-[auto_1fr_auto] flex-col">
        <Container className="border-cBorder border-b-[1px]">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Logo />
              <h2 className="text-sm font-semibold">Timequanta app</h2>
            </div>
            <div>... {/* make a popup*/}</div>
          </div>
          <div className="flex flex-col gap-y-2">
            <Button
              activeClassName="bg-cFocus rounded-[5px]"
              as="link"
              to={routes.inbox}
              intent={"primary"}
              className="flex w-full items-center justify-between"
              size={"sm"}
            >
              <div className="flex items-center justify-center">
                <Icon
                  name={"common/inbox"}
                  className="fill-accent mr-4 text-[20px]"
                />
                {t("task.inbox")}
              </div>
              <span className="text-cOpacitySecondFont">{inboxTasksCount}</span>
            </Button>

            <Button
              activeClassName="bg-cFocus rounded-[5px]"
              as="link"
              to={routes.home}
              intent={"primary"}
              className="flex w-full items-center justify-between"
              size={"sm"}
            >
              <div className="flex items-center justify-center">
                <Icon
                  name={"common/outlined-star"}
                  className="fill-accent mr-4 text-[20px]"
                />
                {t("task.today")}
              </div>
              <span className="text-cOpacitySecondFont">{todayTasksCount}</span>
            </Button>

            <Button
              activeClassName="bg-cFocus rounded-[5px]"
              as="link"
              to={routes.upcoming}
              intent={"primary"}
              className="flex w-full items-center"
              size={"sm"}
            >
              <Icon
                name={"common/upcoming"}
                className="fill-accent mr-4 text-[20px]"
              />
              {t("task.upcoming")}
            </Button>

            <Button
              activeClassName="bg-cFocus rounded-[5px]"
              as="link"
              to={routes.calendar}
              intent={"primary"}
              className="flex w-full items-center"
              size={"sm"}
            >
              <Icon
                name={"common/calendar"}
                className="fill-accent mr-4 text-[20px]"
              />
              {t("task.calendar")}
            </Button>
          </div>
        </Container>
        <Container>
          <Button size={"sm"} className="w-full text-start" intent={"primary"}>
            <Icon name="common/plus" className="text-cOpacitySecondFont mr-4" />
            <span className="text-primary text-[12px]">
              {t("sidebar.project")}
            </span>
          </Button>
        </Container>
        <Container className="border-cBorder text-cIconDefault flex gap-2 border-t-[1px]">
          <Tooltip text={t("setting.title")} dir="tr">
            <Settings />
          </Tooltip>
          <Tooltip text={t("task.unplaced")} dir="tc">
            <Button
              title={t("task.unplaced")}
              to={routes.unplaced}
              as="link"
              intent={"primary"}
              size={"xs"}
            >
              <Icon name="common/cross-arrows" className="text-[24px]" />
            </Button>
          </Tooltip>
          <Tooltip text={t("task.trash")} dir="tc">
            <Button
              title={t("task.trash")}
              to={routes.trash}
              as="link"
              intent={"primary"}
              size={"xs"}
            >
              <Icon name="common/trash-can" className="text-[24px]" />
            </Button>
          </Tooltip>
        </Container>
      </div>
    </aside>
  )
}
