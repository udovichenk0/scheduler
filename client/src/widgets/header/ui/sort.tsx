import { SortConfig, SortType, TaskSorting } from "@/entities/task/task-item"
import { useClickOutside } from "@/shared/lib/react/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { useRef, useState } from "react"

export type SortProps = {
  config: SortConfig[]
  active: SortType
  onChange: (value: SortType) => SortType
}
export const Sort = ({ sorting }: { sorting: SortProps }) => {
  const r = useRef<HTMLDivElement>(null)
  const [isSortingOpened, setIsSortingOpened] = useState(false)  
  useClickOutside({
    ref: r,
    callback: () => setIsSortingOpened(false),
    deps: [isSortingOpened],
  })
  return (
    <div className="relative">
      {sorting && (
        <div ref={r}>
          <Button
            intent={"primary"}
            size={"xs"}
            onClick={() => setIsSortingOpened((prev) => !prev)}
          >
            <Icon
              name={`sort/${sorting.active}`}
              className="text-2xl text-cIconDefault"
            />
          </Button>
          {isSortingOpened && (
            <TaskSorting
              onChange={(value) => {
                setIsSortingOpened(false)
                sorting.onChange(value)
              }}
              config={sorting.config}
              active={sorting.active}
            />
          )}
        </div>
      )}
    </div>
  )
}