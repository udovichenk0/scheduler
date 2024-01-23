import { t } from "i18next"

import { SortConfig, SortType } from "../type"
export const TaskSorting = ({
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
