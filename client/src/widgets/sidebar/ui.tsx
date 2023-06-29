import { useUnit } from "effector-react"
import { $inboxTasks } from "@/entities/task"
import { routes } from "@/shared/config/router"
import { IconButton } from "@/shared/ui/buttons/icon-button"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Icon } from "@/shared/ui/icon/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal/ui"
// eslint-disable-next-line boundaries/element-types
import { Settings } from "../settings"
import { modal } from './sidebar.modal'
import { SideLink } from "./ui/side-link"

export const Sidebar = () => {
  const [inboxTasks] = useUnit([$inboxTasks])
  return (
    <div className={`border-r-[1px] border-cBorder bg-brand text-primary`}>
      <div className="w-[250px] flex flex-col h-full">
        <div className="border-b-[1px] border-cBorder px-2 py-2 mb-2">
          <div className="flex justify-between items-center px-2 mb-2">
            <div className="flex items-center gap-1">
              <div className="relative z-10 bg-gradient-to-tr from-[#4b84ec] flex items-center justify-center h-[22px] w-[22px] to-[#8963cd] rounded-full after:w-[16px] after:h-[16px] after:absolute after:left-[3px] after:top-[3px] after:rounded-full after:bg-[#0d1828]">
                <Icon name="common/done" className="relative w-[8px] h-[8px] z-20 fill-white"/>
              </div>
              <h2>Scheduler App</h2>
            </div>
            <div className="">
							... {/* make a popup*/}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SideLink route={routes.inbox} title="Inbox" rightCount={inboxTasks.length} iconName="common/inbox"/>
            <SideLink route={routes.home} title="Today" iconName="common/star"/>
            <SideLink route={routes.upcoming} title="Upcoming" iconName="common/upcoming"/>
            <SideLink route={routes.calendar} title="Calendar" iconName="common/calendar"/>
          </div>
        </div>
        <div className="px-2 py-1 h-full">
          <Button size={'sm'} title="New Project" className="w-full" intent={'secondary'} icon={<Icon name="common/plus" />} />
        </div>
        <div className="px-2 py-1 border-t-[1px] border-cBorder flex">
          <span>
            <IconButton size={'base'} iconName="common/settings" intent={'leftBottonPanel'} onClick={() => modal.toggleTriggered()}/>
            <BaseModal modal={modal}>
              <Settings />
            </BaseModal>
          </span>
        </div>
      </div>
    </div>
  )
}