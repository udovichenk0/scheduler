import { ReactNode, useContext } from "react"

import { TabContext } from "."

export function Content({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  const { value } = useContext(TabContext)
  return (
    <div className="px-6 py-4" hidden={value != label}>
      {children}
    </div>
  )
}
