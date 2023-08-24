import dayjs from "dayjs"
import { useState } from "react"

import { generateCalendar } from "@/shared/lib/generate-calendar"
import { addLeadingZero } from "@/shared/lib/add-leading-zero"

import { Cell } from "./ui/calendar-cell"
import { MonthSwitcher } from "./ui/month-swithcher"
import { WeeksName } from "./ui/week-names"

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
      <div className="absolute left-[30%] top-[50%] -z-[10] flex h-[50px] items-center text-[90px] font-bold text-main opacity-10 invert">
        {addLeadingZero(currentSetMonth + 1)}
      </div>
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

              return (
                <div
                  className={`w-full border-cBorder py-[2px] ${
                    isTopDateBigger && "border-b-[1px]"
                  } ${isLeftDateBigger && "border-b-[1px] border-r-[1px]"}`}
                  key={`${date}/${month}/${year}`}
                >
                  <Cell
                    onDateChange={onDateChange}
                    year={year}
                    month={month}
                    date={date}
                    currentDate={currentDate}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
