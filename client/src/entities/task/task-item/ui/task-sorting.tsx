import { t } from 'i18next'

import { SortConfig, SortType } from "../type"
export const TaskSorting = ({
  config,
  onChange,
  active
}: {
  config: SortConfig[]
  onChange: (value: SortType) => void
  active: SortType
}) => {
  return (
      <div className="absolute right-0 z-[15] flex w-[215px] flex-col bg-menuBg">
        {config.map(({ value, label }) => {
          return (
            <button
              key={value}
              className={`py-3 pr-4 pl-8  text-[12px] text-left hover:bg-cHover ${
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