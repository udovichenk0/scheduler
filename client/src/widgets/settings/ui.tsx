import { useUnit, useGate } from "effector-react";

import { Tabs } from "@/shared/ui/tab";
import { TabsEnum, gate, tabModel } from "./settings.model";
import { SynchronizationTab, GeneralTab } from './tabs'
import { ThemeTab } from "./tabs/theme";

const tabs = [
  { iconName: 'settings' as const, title: 'General', label: TabsEnum.general },
  { iconName: 'cloud' as const, title: 'Synchronization', label: TabsEnum.synchronization},
  { iconName: 'palette' as const, title: 'Theme', label: TabsEnum.theme}
]


export const Settings = () => {
  const [activeTab, selectTab] = useUnit([tabModel.$activeTab, tabModel.tabSelected])
  useGate(gate)
  return (
    <Tabs>
      <Tabs.TabList onChange={selectTab} className="flex gap-5 border-b-[1px] border-cBorder px-6 pb-4">
        {tabs.map(({iconName, title, label}) => 
          <Tabs.Tab
            label={label} 
            title={title} 
            iconName={`common/${iconName}`} 
            key={label} 
            className={`flex ${activeTab == label && 'text-cFont'} text-[#76899b] ${activeTab != label && 'hover:text-primary'} flex-col gap-3 items-center`}/>
        )}
      </Tabs.TabList>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.general}><GeneralTab/></Tabs.TabPanel>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.synchronization}><SynchronizationTab/></Tabs.TabPanel>
      <Tabs.TabPanel activeValue={activeTab} label={TabsEnum.theme}><ThemeTab/></Tabs.TabPanel>
    </Tabs>
  )
}