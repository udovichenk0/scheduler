import { ReactNode, useContext } from "react"
import clsx from "clsx"

import { TabContext } from "./tab.model"

export function Content({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  const { value, contentStyles } = useContext(TabContext)
  if (value != label) {
    return null
  }
  return <div className={clsx(className, contentStyles)}>{children}</div>
}
