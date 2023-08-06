import dayjs from "dayjs"
import { useState } from "react"

import { generateCalendar } from "@/shared/lib/generate-calendar"

import { Icon } from "../icon"
import { Button } from "../buttons/main-button"

const daysName = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function DatePicker({
  currentDate,
  onDateChange,
}: {
  currentDate: Date
  onDateChange: (date: Date) => void
}) {
  const [dates, setDate] = useState(generateCalendar())
  const [displayedMonth, setDisplayedMonth] = useState(dayjs().month())
  const currentSetMonth = dayjs().month(displayedMonth).month()
  const changeMonth = (month: number) => {
    if (dayjs().month() <= month) {
      setDisplayedMonth(month)
      setDate(generateCalendar(month))
    }
  }
  return (
    <div className="relative mb-4">
      <MonthSwitcher
        displayedMonth={displayedMonth}
        changeMonth={changeMonth}
      />
      <WeeksName />
      <span className="absolute left-[30%] top-[50%] -z-[10] text-[90px] font-bold text-main opacity-10 invert">
        {normilizeDate(currentSetMonth + 1)}
      </span>
      {dates.map((item, rowId) => {
        return (
          <div className="flex justify-around" key={rowId}>
            {item.map(({ date, month, year }, id) => {
              const isTopDateBigger =
                rowId != dates.length - 1 &&
                dates[rowId][id].date > dates[rowId + 1][id].date
              const isLeftDateBigger =
                id != item.length - 1 &&
                dates[rowId][id].date > dates[rowId][id + 1].date
              const isToday = dayjs(new Date(year, month, date)).isSame(
                dayjs(),
                "date",
              )
              const isCurrent = dayjs(new Date(year, month, date)).isSame(
                currentDate,
                "date",
              )
              const isPast = dayjs(new Date(year, month, date)).isBefore(
                dayjs(),
                "date",
              )
              return (
                <div
                  className={`w-full py-[2px] ${
                    isTopDateBigger && "border-b-[1px] border-cBorder"
                  } ${
                    isLeftDateBigger &&
                    "border-b-[1px] border-r-[1px] border-cBorder"
                  }`}
                  key={`${date}/${month}/${year}`}
                >
                  <button
                    onClick={() => onDateChange(new Date(year, month, date))}
                    disabled={isPast || isCurrent}
                    className={`h-[35px] w-[35px] text-[13px] ${
                      !isCurrent && !isPast && "hover:bg-cHover"
                    } 
                          flex items-center justify-center rounded-[5px] 
                          ${isPast && "text-[#AAA]"} ${isToday && "text-accent"}
                          ${isCurrent && "bg-cFocus"}
                          `}
                  >
                    {isToday ? (
                      <Icon name="common/filled-star" />
                    ) : (
                      <div>
                        {date === 1 ? (
                          <div className="grid text-[9px] leading-[9px]">
                            <div>{date}</div>
                            <span>{months[month]}</span>
                          </div>
                        ) : (
                          <span>{date}</span>
                        )}
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
const WeeksName = () => {
  return (
    <div className="flex justify-around border-b-[1px] border-cBorder">
      {daysName.map((name) => {
        return (
          <span className="justify-self-center py-2 text-[12px]" key={name}>
            {name}
          </span>
        )
      })}
    </div>
  )
}
const MonthSwitcher = ({
  changeMonth,
  displayedMonth,
}: {
  changeMonth: (month: number) => void
  displayedMonth: number
}) => {
  const isCurrentMonth = dayjs().month() === displayedMonth
  return (
    <div className="flex items-center justify-end gap-2 text-primary">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(displayedMonth - 1)}
      >
        <Icon
          name="common/arrow"
          className={`rotate-180 text-[8px] ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs().month())}
        disabled={isCurrentMonth}
        className={`text-[11px] font-bold text-accent ${
          isCurrentMonth && "opacity-80"
        }`}
      >
        Today
      </button>
      <Button
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(displayedMonth + 1)}
      >
        <Icon name="common/arrow" className="translate-x-[1px] text-[8px]" />
      </Button>
    </div>
  )
}

function normilizeDate(month: number) {
  return month.toString().padStart(2, "0")
}
