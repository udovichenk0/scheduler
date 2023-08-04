import { useUnit } from "effector-react"
import { Settings } from "@/widgets/settings"
import { routes } from "@/shared/routing"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Icon } from "@/shared/ui/icon/icon"
import { $inboxTasksCount, $todayTasksCount, modal } from "./sidebar.modal"
import { Logo } from "./ui/logo"
import { SideLink } from "./ui/side-link"

export const Sidebar = () => {
  const [inboxTasksCount, todayTasksCount, toggleTriggered] = useUnit([
    $inboxTasksCount,
    $todayTasksCount,
    modal.toggleTriggered,
  ])
  return (
    <aside className={`border-r-[1px] border-cBorder bg-brand text-primary`}>
      <div className="flex h-full w-[250px] flex-col">
        <div className="mb-2 border-b-[1px] border-cBorder px-2 py-2">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <Logo />
              <h2 className="text-sm font-semibold">Timequanta app</h2>
            </div>
            <div>... {/* make a popup*/}</div>
          </div>
          <div className="gap-2 space-y-2">
            <SideLink
              route={routes.inbox}
              title="Inbox"
              rightCount={inboxTasksCount}
              iconName="common/inbox"
            />
            <SideLink
              route={routes.home}
              title="Today"
              rightCount={todayTasksCount}
              iconName="common/outlined-star"
            />
            <SideLink
              route={routes.upcoming}
              title="Upcoming"
              iconName="common/upcoming"
            />
            <SideLink
              route={routes.calendar}
              title="Calendar"
              iconName="common/calendar"
            />
          </div>
        </div>
        <div className="h-full px-2 py-1">
          <Button
            size={"sm"}
            className="w-full text-start"
            intent={"primary"}
          >
            <Icon name="common/plus" className="mr-4 text-cOpacitySecondFont" />
            <span className="text-[12px] text-cOpacitySecondFont">New Project</span>
          </Button>
        </div>
        <div className="flex border-t-[1px] border-cBorder px-2 py-1">
          <div>
            <Button onClick={toggleTriggered} intent={"primary"} size={"xs"}>
              <Icon name="common/settings" className="text-[20px]" />
            </Button>
            <Button onClick={toggleTriggered} intent={"primary"} size={"xs"}>
              <Icon name="common/cross-arrows" className="text-[20px]" />
            </Button>
          </div>
            <Settings modal={modal} defaultTab="general" />
        </div>
      </div>
    </aside>
  )
}
