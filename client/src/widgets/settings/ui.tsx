import { Icon } from "@/shared/ui/icon";
import { Root } from "@/shared/ui/tab";
import { SynchronizationTab, GeneralTab } from './tabs'
import { ThemeTab } from "./tabs/theme";

enum TabsEnum {
  general = 'general',
  synchronization = 'synchronization',
  theme = 'theme'
}
const tabs = [
  { iconName: 'settings' as const, title: 'General', label: TabsEnum.general },
  { iconName: 'cloud' as const, title: 'Synchronization', label: TabsEnum.synchronization},
  { iconName: 'palette' as const, title: 'Theme', label: TabsEnum.theme}
]


export const Settings = () => {
  return (
    <Root defaultValue={TabsEnum.general} className="">
      <Root.List className="flex gap-5 border-b-[1px] border-cBorder px-6 pb-4">
        {tabs.map(({iconName, title, label}) => 
          <Root.Trigger
            value={label} 
            key={label} 
            activeClass={'text-cFont'}
            className={`flex text-[#76899b] hover:text-primary flex-col gap-3 items-center`}>
              <Icon name={`common/${iconName}`} className="w-8 h-8"/>
              <span className="text-inherit">{title}</span>
            </Root.Trigger>
        )}
      </Root.List>
      <Root.Content label={TabsEnum.general}><GeneralTab/></Root.Content>
      <Root.Content label={TabsEnum.synchronization}><SynchronizationTab/></Root.Content>
      <Root.Content label={TabsEnum.theme}><ThemeTab/></Root.Content>
    </Root>
  )
}