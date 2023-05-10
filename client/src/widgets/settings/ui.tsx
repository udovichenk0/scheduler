import { Children, useState } from "react";
import { SettingSvg } from "./assets/settings.svg";
import { Synchronization } from "./assets/synchronization.svg";
import { SynchronizationTab, GeneralTab } from './tabs'
import { ReactNode } from 'react'
import { Tab } from "@/shared/ui/tab";
enum Tabs {
	general,
	synchronization
}
const settingElements = [
	{ Icon: SettingSvg, title: 'General', label: Tabs.general },
	{ Icon: Synchronization, title: 'Synchronization', label: Tabs.synchronization}
]

export const Settings = () => {
	const [active, setActive] = useState<Tabs>(Tabs.general)
	return (
		<div>
			<div className="flex gap-5 border-b-[1px] border-white/10 px-6 pb-3">
				{settingElements.map((elem, id) => {
					return (
						<button key={id} onClick={() => setActive(elem.label)}
							className={`flex ${active == elem.label ? 'text-white fill-white' : 'fill-[#76899b] text-[#76899b]'}
											 ${active != elem.label && 'hover:fill-white/60 hover:text-white/60'} flex-col gap-3 items-center`}>
							<elem.Icon />
							<span className="text-inherit">{elem.title}</span>
						</button>
					)
				})}
			</div>
			<div>
				<Tab activeValue={active} label={Tabs.general}><GeneralTab/></Tab>
				<Tab activeValue={active} label={Tabs.synchronization}><SynchronizationTab/></Tab>
			</div>
		</div>
	)
}
