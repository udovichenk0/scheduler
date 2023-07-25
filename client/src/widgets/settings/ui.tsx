import { Icon } from "@/shared/ui/icon";
import { Root } from "@/shared/ui/tab";
import { SynchronizationTab, GeneralTab } from './tabs'
import { ThemeTab } from "./tabs/theme";

const tabsName = {
  general: 'general' as const,
  synchronization: 'synchronization' as const,
  theme: 'theme' as const
}
const tabs = [
  { iconName: 'settings' as const, title: 'General', label: tabsName.general },
  { iconName: 'cloud' as const, title: 'Synchronization', label: tabsName.synchronization},
  { iconName: 'palette' as const, title: 'Theme', label: tabsName.theme}
]

export const Settings = ({
  defaultTab = tabsName.general
}: {
  defaultTab: Keys<typeof tabsName>
}) => {
  return (
    <Root defaultValue={defaultTab} className="text-sm">
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
      <Root.Content label={tabsName.general}><GeneralTab/></Root.Content>
      <Root.Content label={tabsName.synchronization}><SynchronizationTab/></Root.Content>
      <Root.Content label={tabsName.theme}><ThemeTab/></Root.Content>
    </Root>
  )
}