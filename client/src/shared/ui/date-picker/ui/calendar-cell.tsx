import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES, SHORT_MONTHS_NAMES } from "@/shared/config/constants"

import { Icon } from "../../icon"
import { useRef } from "react"
import { onMount } from "@/shared/lib/react"


export const Cell = ({
  onDateChange,
  cellDate,
  currentDate,
}: {
  onDateChange: (date: Date) => void
  cellDate: {
    day: number
    year: number
    month: number
    date: number
  }
  currentDate: Date
}) => {
  const focusRef = useRef<HTMLButtonElement>(null)
  const { year, month, date, day } = cellDate
  const isToday = dayjs(new Date(year, month, date)).isSame(dayjs(), "date")
  const isPast = dayjs(new Date(year, month, date)).isBefore(dayjs(), "date")
  const isTaskDate = dayjs(new Date(year, month, date)).isSame(
    currentDate,
    "date",
  )
  const { t } = useTranslation()
  onMount(() => {
    if(isToday){
      focusRef.current && focusRef.current.focus()
    }
  })
  return (
    <button
      ref={focusRef}
      onClick={() => onDateChange(new Date(year, month, date))}
      disabled={isPast || isTaskDate}
      className={`h-[35px] w-[35px] text-[13px] ${
        !isTaskDate && !isPast && "hover:bg-cHover"
      } 
        flex items-center justify-center rounded-[5px] text-cCalendarFont 
        ${isPast && "text-cSecondBorder"} 
        `}
    >
      {isToday ? (
        <Icon name="common/filled-star" className="text-accent" />
      ) : (
        <div aria-hidden>
          {date === 1 || isTaskDate ? (
            <div className="grid text-[9px] leading-[9px]">
              <div>{date}</div>
              <div>{year}</div>
              <span>{t(SHORT_MONTHS_NAMES[month])}</span>
            </div>
          ) : (
            <span>{date}</span>
          )}
        </div>
      )}
      <span className="sr-only">{t(LONG_WEEKS_NAMES[day])} {t(LONG_MONTHS_NAMES[month])} {date} {year}</span>
    </button>
  )
}
