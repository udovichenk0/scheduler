import { ReactNode } from "react"
import { Tab } from "./tab"
import { TabList } from "./tab-list"
import { TabPanel } from "./tab-panel"

type TabsProps = {
  children: ReactNode,
  className?: string
}

export const Tabs = ({children, className}: TabsProps) => {
  return (
    <div className={className}>
      {children}      
    </div>
  )
}

Tabs.TabPanel = TabPanel
Tabs.TabList = TabList
Tabs.Tab = Tab
// Tabs.Tab = Tab