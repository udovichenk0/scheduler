import { useTranslation } from "react-i18next"

import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"
import { SDate, sdate } from "@/shared/lib/date/lib"

export const CellHeader = ({ cell }: { cell: SDate }) => {
  const { t } = useTranslation()

  const isPast = cell.isBeforeDate(sdate())
  const month = cell.month
  const date = cell.date
  const isFirstDate = date === 1

  return (
    <div className="mb-1 flex items-center justify-end gap-1">
      {isFirstDate && (
        <span className="text-sm">{t(SHORT_MONTHS_NAMES[month])}</span>
      )}
      <div
        className={`${isPast && "opacity-30"} text-end ${
          cell.isToday &&
          "bg-cFocus flex h-6 w-6 items-center justify-center rounded-full p-2"
        }`}
      >
        <span>{date}</span>
      </div>
    </div>
  )
}
