import { useUnit } from "effector-react";

import { Icon } from "@/shared/ui/icon/icon";
import { Tab, TabPanel, Tabs } from "@/shared/ui/tab";
import { TabsEnum } from "./config";
import { $activeTab, tabSelected } from "./settings.model";
import { SynchronizationTab, GeneralTab } from './tabs'

const tabs = [
	{ iconName: 'settings' as const, title: 'General', label: TabsEnum.general },
	{ iconName: 'cloud' as const, title: 'Synchronization', label: TabsEnum.synchronization}
]

const tabClassName = 'flex aria-[pressed=true]:text-white aria-[pressed=true]:fill-white fill-[#76899b] text-[#76899b] aria-[pressed=false]:hover:fill-white/60 aria-[pressed=false]:hover:text-white/60  flex-col gap-3 items-center'

export const Settings = () => {
	const [activeTab, selectTab] = useUnit([$activeTab, tabSelected])
	return (
		<div>
			<div className="flex gap-5 border-b-[1px] border-white/10 px-6 pb-4">
				<Tabs onChange={selectTab}>
					{tabs.map(({iconName, title, label}) => 
						<Tab label={label} aria-pressed={activeTab == label} key={label} className={tabClassName}>
							<Icon name={`common/${iconName}`} className="w-8 h-8"/>
							<span className="text-inherit">{title}</span>
						</Tab>
					)}
				</Tabs>
			</div>
				<TabPanel activeValue={activeTab} label={TabsEnum.general}><GeneralTab/></TabPanel>
				<TabPanel activeValue={activeTab} label={TabsEnum.synchronization}><SynchronizationTab/></TabPanel>
		</div>
	)
}



