import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { SHORT_MONTHS_NAMES } from "@/shared/config/constants"

import { Icon } from "../../icon"

export const Cell = ({
  onDateChange,
  year,
  month,
  date,
  currentDate,
}: {
  onDateChange: (date: Date) => void
  year: number
  month: number
  date: number
  currentDate: Date
}) => {
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isTaskDate = dayjs(new Date(year, month, date)).isSame(
    currentDate,
    "date",
  )
  const { t } = useTranslation()
  return (
    <button
      onClick={() => onDateChange(new Date(year, month, date))}
      // disabled={isPast || isTaskDate}
      className={`h-[35px] w-[35px] text-[13px] ${
        !isTaskDate && !isPast && "hover:bg-cHover"
      } 
        flex items-center justify-center rounded-[5px] text-cCalendarFont 
        ${isPast && "text-cSecondBorder"} 
        ${isTaskDate && "bg-accent/20"}
        `}
    >
      {isToday ? (
        <Icon name="common/filled-star" className="text-accent" />
      ) : (
        <div>
          {date === 1 || isTaskDate ? (
            <div className="grid text-[9px] leading-[9px]">
              <div>{date}</div>
              <span>{t(SHORT_MONTHS_NAMES[month])}</span>
            </div>
          ) : (
            <span>{date}</span>
          )}
        </div>
      )}
    </button>
  )
}
