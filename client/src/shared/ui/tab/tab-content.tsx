import { ReactNode, useContext } from "react"

import { TabContext } from "./tab.model"

export function Content({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const { value } = useContext(TabContext)
  if (value != label) {
    return null
  }
  return <div className="px-6 py-4">{children}</div>
}
