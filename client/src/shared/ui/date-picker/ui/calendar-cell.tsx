import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { useRef } from "react"

import {
  LONG_MONTHS_NAMES,
  LONG_WEEKS_NAMES,
  SHORT_MONTHS_NAMES,
} from "@/shared/config/constants"
import { onMount } from "@/shared/lib/react/on-mount.ts"
import { removeTimePart } from "@/shared/lib/date/remove-time-part.ts"

import styles from "./styles.module.css"

export const Cell = ({
  onDateChange,
  cellDate,
  startDate,
  dueDate,
}: {
  onDateChange: (date: Date) => void
  cellDate: Date
  startDate: Nullable<Date>
  dueDate: Nullable<Date>
}) => {
  const focusRef = useRef<HTMLButtonElement>(null)
  const isToday = dayjs(cellDate).isSame(dayjs(), "date")
  const isPast = dayjs(cellDate).isBefore(dayjs(), "date")

  const { t } = useTranslation()

  const isStartDate =
    startDate && dayjs(cellDate).isSame(removeTimePart(startDate), "date")
  const isDueDate =
    dueDate && dayjs(cellDate).isSame(removeTimePart(dueDate), "date")
  const isBetween =
    startDate &&
    dueDate &&
    dayjs(cellDate).isBetween(
      removeTimePart(startDate),
      removeTimePart(dueDate),
    )

  onMount(() => {
    if (isToday) {
      focusRef.current && focusRef.current.focus({ preventScroll: true })
    }
  })

  const date = cellDate.getDate()
  const day = cellDate.getDay()
  const month = cellDate.getMonth()
  const year = cellDate.getFullYear()

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
        data-istoday={isToday && !isStartDate && !isDueDate}
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
