import { routes } from "@/shared/config/router"
import { Button } from "@/shared/ui/buttons/button/ui"
import { HoverIconButton } from "@/shared/ui/buttons/hover-icon-button"
import { MainButton } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal/ui"
// eslint-disable-next-line boundaries/element-types
import { Settings } from "../settings"
import { modal } from './sidebar.modal'

export const Sidebar = () => {
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
            {/* <Button route={routes.inbox} title="Inbox" size={'small'} intent={'base-white'} icon={<Icon name="common/inbox" className="fill-azure h-[20px] w-[20px]"/>} />
            <Button title="Today" size={'small'} intent={'base-white'} icon={<Icon name="common/star" className="fill-azure h-[20px] w-[20px]"/>} />
            <Button title="Upcoming" size={'small'} intent={'base-white'} icon={<Icon name="common/upcoming" className="fill-azure h-[20px] w-[20px]"/>} />
            <Button title="Calendar" size={'small'} intent={'base-white'} icon={<Icon name="common/calendar" className="fill-azure h-[20px] w-[20px]"/>} />	 */}
            <MainButton route={routes.inbox} title="Inbox" icon="common/inbox"/>
            <MainButton route={routes.inbox} title="Today" icon="common/star"/>
            <MainButton route={routes.inbox} title="Upcoming" icon="common/upcoming"/>
            <MainButton route={routes.inbox} title="Calendar" icon="common/calendar"/>
          </div>
        </div>
        <div className="px-2 py-1 h-full">
          <Button size={'small'} title="New Project" intent={'base-gray'} icon={<Icon name="common/plus" />} />
        </div>
        <div className="px-2 py-1 border-t-[1px] border-cBorder flex">
          <span>
            <HoverIconButton icon={<Icon name="common/settings" className="text-cLeftBottomPanel h-[20px] w-[20px]"/>} action={() => modal.toggleTriggered()}/>
            <BaseModal modal={modal}>
              <Settings />
            </BaseModal>
          </span>
        </div>
      </div>
    </div>
  )
}