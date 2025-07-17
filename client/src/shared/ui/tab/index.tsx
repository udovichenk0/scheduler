import { ReactNode, useState } from "react"

import { Content } from "./tab-content"
import { List } from "./tab-list"
import { Trigger } from "./tab-trigger"
import { TabContext } from "./tab.model"

type TabsProps<T> = {
  children: ReactNode
  className?: string
  defaultValue?: string
  value?: T 
  onChange?: (value: T) => void
}

export const Tabs = <T extends string,>({
  children,
  className,
  defaultValue,
  value: customValue,
  onChange,
}: TabsProps<T>) => {
  const [value, setValue] = useState(defaultValue || "")
  return (
    <div className={className}>
      <TabContext.Provider
        value={{ value: customValue || value, setValue: onChange || setValue }}
      >
        {children}
      </TabContext.Provider>
    </div>
  )
}

Tabs.Content = Content
Tabs.List = List
Tabs.Trigger = Trigger
