import { useTranslation } from "react-i18next"
import { useRef } from "react"

import {
  LONG_MONTHS_NAMES,
  LONG_WEEKS_NAMES,
  SHORT_MONTHS_NAMES,
} from "@/shared/config/constants"
import { onMount } from "@/shared/lib/react/on-mount.ts"
import { SDate, sdate } from "@/shared/lib/date/lib"

import styles from "./styles.module.css"

export const Cell = ({
  onDateChange,
  cellDate,
  startDate,
  dueDate,
}: {
  onDateChange: (date: SDate) => void
  cellDate: SDate
  startDate: Nullable<SDate>
  dueDate: Nullable<SDate>
}) => {
  const focusRef = useRef<HTMLButtonElement>(null)
  const isTodayDate = cellDate.isToday
  const isPast = cellDate.isBeforeDate(sdate())

  const { t } = useTranslation()

  const isStartDate = startDate && cellDate.isSameDate(startDate)
  const isDueDate = dueDate && cellDate.isSameDate(dueDate)
  const isBetween =
    startDate &&
    dueDate &&
    cellDate.isAfterDate(startDate) &&
    cellDate.isBeforeDate(dueDate)

  onMount(() => {
    if (isTodayDate) {
      focusRef.current && focusRef.current.focus({ preventScroll: true })
    }
  })

  const date = cellDate.date
  const day = cellDate.day
  const month = cellDate.month
  const year = cellDate.year

  return (
    <div
      data-startdate={dueDate && isStartDate}
      data-duedate={startDate && isDueDate}
      data-between={isBetween}
      className={`${styles.cellWrapper}`}
    >
      <button
        ref={focusRef}
        onClick={() => {
          if (isPast || isStartDate || isDueDate) return
          onDateChange(cellDate)
        }}
        data-active={isStartDate || isDueDate}
        data-istoday={isTodayDate && !isStartDate && !isDueDate}
        className={`
          ${styles.cell} 
          focus-visible:border-cSecondBorder text-cCalendarFont relative z-20 flex size-[35px] items-center justify-center rounded-[5px] text-[13px] focus-visible:border
          ${!isStartDate && !isDueDate && !isPast && "hover:bg-hover"} 
          ${isPast && "text-cSecondBorder"}
          ${!isPast && "cursor-pointer"}
        `}
      >
        <div>
          {date === 1 || isStartDate ? (
            <div className="text-[9px] leading-[9px]">
              <div>{date}</div>
              <div>{year}</div>
              <span>{t(SHORT_MONTHS_NAMES[month])}</span>
            </div>
          ) : (
            <span>{date}</span>
          )}
        </div>
        <span className="sr-only">
          {t(LONG_WEEKS_NAMES[day])} {t(LONG_MONTHS_NAMES[month])} {date} {year}
        </span>
      </button>
    </div>
  )
}
