import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"

import { CellProps } from "./cell"

export const CellHeader = ({ cell }: { cell: CellProps }) => {
  const { t } = useTranslation()
  const { date, month, year } = cell
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isFirstDate = cell.date === 1

  return (
    <div className="mb-1 flex items-center justify-end gap-1">
      {isFirstDate && (
        <span className="text-sm">{t(SHORT_MONTHS_NAMES[month])}</span>
      )}
      <div
        className={`${isPast && "opacity-30"} text-end ${
          isToday &&
          "flex h-6 w-6 items-center justify-center rounded-full bg-cFocus p-2"
        }`}
      >
        <span>{date}</span>
      </div>
    </div>
  )
}
