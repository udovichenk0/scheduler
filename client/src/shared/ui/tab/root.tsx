import { ReactNode, useState } from "react"

import { Content } from "./tab-content"
import { List } from "./tab-list"
import { Trigger } from "./tab-trigger"
import { TabContext } from "./tab.model"

type TabsProps = {
  children: ReactNode
  className?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
}

export const Root = ({ children, className, defaultValue, value: customValue, onChange }: TabsProps) => {
  const [value, setValue] = useState(defaultValue || "")
  return (
    <div className={className}>
      <TabContext.Provider value={{ value: customValue || value, setValue: onChange || setValue }}>
        {children}
      </TabContext.Provider>
    </div>
  )
}

Root.Content = Content
Root.List = List
Root.Trigger = Trigger
