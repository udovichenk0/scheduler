import { useUnit } from "effector-react"
// eslint-disable-next-line boundaries/element-types
import { Settings } from "@/widgets/settings"
import { routes } from "@/shared/config/router"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Icon } from "@/shared/ui/icon/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal/ui"
import { $inboxTasksCount, $todayTasksCount, modal } from './sidebar.modal'
import { Logo } from "./ui/logo"
import { SideLink } from "./ui/side-link"

export const Sidebar = () => {
  const [
    inboxTasksCount,
    todayTasksCount,
  ] = useUnit([
    $inboxTasksCount,
    $todayTasksCount,
  ])
  return (
    <aside className={`border-r-[1px] border-cBorder bg-brand text-primary`}>
      <div className="w-[250px] flex flex-col h-full">
        <div className="border-b-[1px] border-cBorder px-2 py-2 mb-2">
          <div className="flex justify-between items-center px-2 mb-2">
            <div className="flex items-center gap-1">
              <Logo/>
              <h2 className="text-sm font-semibold">Timequanta app</h2>
            </div>
            <div>
							... {/* make a popup*/}
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <SideLink route={routes.inbox} title="Inbox" rightCount={inboxTasksCount} iconName="common/inbox"/>
            <SideLink route={routes.home} title="Today" rightCount={todayTasksCount} iconName="common/outlined-star"/>
            <SideLink route={routes.upcoming} title="Upcoming" iconName="common/upcoming"/>
            <SideLink route={routes.calendar} title="Calendar" iconName="common/calendar"/>
          </nav>
        </div>
        <div className="px-2 py-1 h-full">
          <Button size={'sm'} title="New Project" className="w-full" intent={'secondary'} icon={<Icon name="common/plus" />} />
        </div>
        <div className="px-2 py-1 border-t-[1px] border-cBorder flex">
          <div>
            <IconButton size={'base'} iconName="common/settings" intent={'leftBottonPanel'} onClick={() => modal.toggleTriggered()}/>
            <BaseModal modal={modal}>
                <Settings />
            </BaseModal>
          </div>
        </div>
      </div>
    </aside>
  )
}