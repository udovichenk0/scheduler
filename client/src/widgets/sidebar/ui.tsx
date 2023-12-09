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
} from "./sidebar.modal"
import { Logo } from "./ui/logo"

export const Sidebar = () => {
  const { t } = useTranslation()
  const inboxTasksCount = useUnit($inboxTasksCount)
  const todayTasksCount = useUnit($todayTasksCount)
  const openSettingsModal = useUnit($$modal.open)

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
            as="link"
            to={routes.inbox}
            intent={'primary'} className="w-full flex items-center justify-between" size={'sm'}>
              <div className="flex">
                <Icon name={'common/inbox'} className="text-[20px] mr-4 fill-accent" />
                {t('task.inbox')}
              </div>
              <span className="text-grey">{inboxTasksCount}</span>
            </Button>

            <Button 
              as='link'
              to={routes.home}
              intent={'primary'} 
              className="w-full flex items-center justify-between" 
              size={'sm'}>
              <div className="flex">
                <Icon name={'common/outlined-star'} className="text-[20px] mr-4 fill-accent" />
                {t('task.today')}
              </div>
              <span className="text-grey">{todayTasksCount}</span>
            </Button>

            <Button 
              as="link" 
              to={routes.upcoming} 
              intent={'primary'} 
              className="w-full flex items-center" size={'sm'}
              >
                <Icon name={'common/upcoming'} className="text-[20px] mr-4 fill-accent" />
                {t('task.upcoming')}
            </Button>

            <Button 
              as="link" 
              to={routes.calendar} 
              intent={'primary'} 
              className="w-full flex items-center" size={'sm'}
              >
                <Icon name={'common/calendar'} className="text-[20px] mr-4 fill-accent" />
                {t('task.calendar')}
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
            as="link"
            to={routes.unplaced}
            title="Unplaced"
            intent={"primary"}
            size={"xs"}
          >
            <Icon name="common/cross-arrows" className="text-[24px]" />
          </Button>
          <Button
            as="link"
            to={routes.trash}
            title="Trash"
            intent={"primary"}
            size={"xs"}
          >
            <Icon name="common/trash-can" className="text-[24px]" />
          </Button>
          <Settings modal={$$modal} defaultTab="general" />
        </Container>
      </div>
    </aside>
  )
}
