
import { Button } from "@/shared/ui/buttons/main-button/ui"
import { BaseModal } from "@/shared/ui/modals/base-modal/ui"

import { Settings } from "../settings"

import { AddSvg } from "./assets/add.svg"
import { CalendarSvg } from "./assets/calendar.svg"
import { DownloadSvg } from "./assets/inbox.svg"
import { LogoSvg } from "./assets/logo.svg"
import { SettingSvg } from "./assets/settings.svg"
import { StarSvg } from "./assets/star.svg"
import { UpcomingSvg } from "./assets/upcoming.svg"
import { modal } from './sidebar.modal'


export const Sidebar = () => {
	return (
		<div className="border-r-[1px] border-white/10">
			<div className="w-[250px] flex flex-col h-full">
				<div className="border-b-[1px] border-white/10 px-2 py-2 mb-2">
					<div className="flex justify-between items-center px-2 mb-2">
						<div className="flex items-center gap-1">
							<LogoSvg />
							<h2 className="text-sm">Scheduler App</h2>
						</div>
						<div className="">
							... {/* make a popup*/}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<Button title="Inbox" size={'medium'} intent={'base-white'} logo={<DownloadSvg />} />
						<Button title="Today" size={'medium'} intent={'base-white'} logo={<StarSvg />} />
						<Button title="Upcoming" size={'medium'} intent={'base-white'} logo={<UpcomingSvg />} />
						<Button title="Calendar" size={'medium'} intent={'base-white'} logo={<CalendarSvg />} />
					</div>
				</div>
				<div className="px-2 py-1 h-full">
					<Button title="New Project" size={'small'} intent={'base-gray'} logo={<AddSvg />} />
				</div>
				<div className="px-2 py-1 border-t-[1px] border-white/10 flex">
					<span>
						<Button onClick={() => modal.toggleTriggered()} intent={'base-white'} size={'base'} logo={<SettingSvg />} />
						<BaseModal modal={modal}>
							<Settings />
						</BaseModal>
					</span>
				</div>
			</div>
		</div>
	)
}