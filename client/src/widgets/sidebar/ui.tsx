import { HoverIconButton } from "@/shared/ui/buttons/hover-icon-button"
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { Icon } from "@/shared/ui/icon/icon"
import { BaseModal } from "@/shared/ui/modals/base-modal/ui"
// eslint-disable-next-line boundaries/element-types
import { Settings } from "../settings"
import { modal } from './sidebar.modal'



export const Sidebar = () => {
	return (
		<div className="border-r-[1px] border-white/10">
			<div className="w-[250px] flex flex-col h-full">
				<div className="border-b-[1px] border-white/10 px-2 py-2 mb-2">
					<div className="flex justify-between items-center px-2 mb-2">
						<div className="flex items-center gap-1">
							<div className="relative z-10 bg-gradient-to-tr from-[#4b84ec] flex items-center justify-center h-[22px] w-[22px] to-[#8963cd] rounded-full after:w-[16px] after:h-[16px] after:absolute after:left-[3px] after:top-[3px] after:rounded-full after:bg-[#0d1828]">
								<Icon name="common/done" className="relative w-[11px] h-[11px] z-20 fill-grey"/>
							</div>
							<h2 className="text-sm">Scheduler App</h2>
						</div>
						<div className="">
							... {/* make a popup*/}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Button title="Inbox" size={'small'} intent={'base-white'} icon={<Icon name="common/inbox" className="fill-azure h-[20px] w-[20px]"/>} />
						<Button title="Today" size={'small'} intent={'base-white'} icon={<Icon name="common/star" className="fill-azure h-[20px] w-[20px]"/>} />
						<Button title="Upcoming" size={'small'} intent={'base-white'} icon={<Icon name="common/upcoming" className="fill-azure h-[20px] w-[20px]"/>} />
						<Button title="Calendar" size={'small'} intent={'base-white'} icon={<Icon name="common/calendar" className="fill-azure h-[20px] w-[20px]"/>} />
					</div>
				</div>
				<div className="px-2 py-1 h-full">
					<Button size={'small'} title="New Project" intent={'base-gray'} icon={<Icon name="common/plus" />} />
				</div>
				<div className="px-2 py-1 border-t-[1px] border-white/10 flex">
					<span>
						<HoverIconButton icon={<Icon name="common/settings" className="fill-azure h-[20px] w-[20px]"/>} action={() => modal.toggleTriggered()}/>
						{/* <Button onClick={() => modal.toggleTriggered()} intent={'base-white'} size={'base'} icon={<SettingSvg />} /> */}
						<BaseModal modal={modal}>
							<Settings />
						</BaseModal>
					</span>
				</div>
			</div>
		</div>
	)
}