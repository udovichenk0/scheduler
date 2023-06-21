import { useUnit } from "effector-react";

import { Icon } from "@/shared/ui/icon/icon";
import { Tabs } from "@/shared/ui/tab";
import { TabsEnum, tabModel } from "./settings.model";
import { SynchronizationTab, GeneralTab } from './tabs'
import { ThemeTab } from "./tabs/theme";

const tabs = [
  { iconName: 'settings' as const, title: 'General', label: TabsEnum.general },
  { iconName: 'cloud' as const, title: 'Synchronization', label: TabsEnum.synchronization},
  { iconName: 'palette' as const, title: 'Theme', label: TabsEnum.theme}
]

const tabClassName = 'flex aria-[pressed=true]:text-cFont text-[#76899b] aria-[pressed=false]:hover:text-primary flex-col gap-3 items-center'

export const Settings = () => {
  const [activeTab, selectTab] = useUnit([tabModel.$activeTab, tabModel.tabSelected])
  return (
    <Tabs>
      <Tabs.TabList onChange={selectTab} className="flex gap-5 border-b-[1px] border-cBorder px-6 pb-4">
        {tabs.map(({iconName, title, label}) => 
          <Tabs.Tab label={label} aria-pressed={activeTab == label} key={label} className={tabClassName}>
            <Icon name={`common/${iconName}`} className="w-8 h-8"/>
            <span className="text-inherit">{title}</span>
          </Tabs.Tab>
        )}
      </Tabs.TabList>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.general}><GeneralTab/></Tabs.TabPanel>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.synchronization}><SynchronizationTab/></Tabs.TabPanel>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.theme}><ThemeTab/></Tabs.TabPanel>
    </Tabs>
  )
}