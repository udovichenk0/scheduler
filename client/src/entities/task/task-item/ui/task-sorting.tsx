import { t } from "i18next"

import { SortConfig, SortType } from "../type"
import { useRef, useState } from "react"
import { useClickOutside } from "@/shared/lib/react/on-click-outside"
import { useTranslation } from "react-i18next"
import { Tooltip } from "@/shared/ui/general/tooltip"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
export type SortProps = {
  config: SortConfig[]
  active: SortType
  onChange: (value: SortType) => SortType
}
export const Sort = ({ sorting }: { sorting?: SortProps }) => {
  const r = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
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
          <Tooltip text={t("sort.title")} dir="bl">
            <Button
              intent={"primary"}
              size={"xs"}
              onClick={() => setIsSortingOpened((prev) => !prev)}
            >
              <Icon
                name={`sort/${sorting.active}`}
                className="text-2xl text-cIconDefault"
              />
              <span className="sr-only">Open sorting</span>
            </Button>
          </Tooltip>
          {isSortingOpened && (
            <TaskSortingPopup
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
export const TaskSortingPopup = ({
  config,
  onChange,
  active,
}: {
  config: SortConfig[]
  onChange: (value: SortType) => void
  active: SortType
}) => {
  return (
    <div className="absolute right-0 z-[1000] flex w-[215px] flex-col bg-main">
      {config.map(({ value, label }) => {
        return (
          <button
            key={value}
            className={`py-3 pl-8 pr-4  text-left text-[12px] hover:bg-cHover ${
              value === active && "bg-cHover"
            }`}
            onClick={() => onChange(value)}
          >
            {t(label)}
          </button>
        )
      })}
    </div>
  )
}
