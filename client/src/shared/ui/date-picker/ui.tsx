import dayjs from "dayjs"
import { useState } from "react"
import { generateCalendar } from "@/shared/lib/generate-calendar"
import { Icon } from "../icon"

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
  const currentSetMonth = dayjs(
    new Date(dayjs().year(), displayedMonth, dayjs().date()),
  ).month()
  const isCurrentMonth = dayjs().month() === displayedMonth
  const changeMonth = (month: number) => {
    if (dayjs().month() <= month) {
      setDisplayedMonth(month)
      setDate(generateCalendar(month))
    }
  }
  return (
    <>
      <div className="flex items-center justify-end gap-2 text-primary">
        <button
          disabled={isCurrentMonth}
          onClick={() => changeMonth(displayedMonth - 1)}
          className={`${
            isCurrentMonth && "opacity-50"
          } flex h-6 w-6 rotate-180 items-center justify-center rounded-[5px] p-2 text-sm text-primary outline-none transition-colors duration-150 hover:bg-cHover`}
        >
          <Icon name="common/arrow" className="h-[8px] w-[8px]" />
        </button>

        <button
          onClick={() => changeMonth(dayjs().month())}
          disabled={isCurrentMonth}
          className={`text-[11px] font-bold text-accent ${
            isCurrentMonth && "opacity-80"
          }`}
        >
          Today
        </button>

        <button
          onClick={() => changeMonth(displayedMonth + 1)}
          className="flex h-6 w-6 items-center justify-center rounded-[5px] p-2 text-sm text-primary outline-none transition-colors duration-150 hover:bg-cHover"
        >
          <Icon
            name="common/arrow"
            className="h-[8px] w-[8px] translate-x-[1px]"
          />
        </button>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-7 border-b-[1px] border-cBorder text-primary">
          {daysName.map((name) => {
            return (
              <div className="justify-self-center py-2 text-[12px]" key={name}>
                {name}
              </div>
            )
          })}
        </div>
        <div className="relative text-primary">
          <span className="absolute left-[30%] top-[30%] -z-[10] text-[90px] font-bold text-main opacity-10 invert">
            {currentSetMonth + 1 < 10
              ? `0${currentSetMonth + 1}`
              : currentSetMonth + 1}
          </span>
          {dates.map((item, rowId) => {
            return (
              <div className="grid grid-cols-7" key={rowId}>
                {item.map(({ date, month, year }, id) => {
                  const isTopDateBigger =
                    rowId != dates.length - 1 &&
                    dates[rowId][id].date > dates[rowId + 1][id].date
                  const isLeftDateBigger =
                    id != item.length - 1 &&
                    dates[rowId][id].date > dates[rowId][id + 1].date
                  const isToday =
                    isCurrentMonth &&
                    dayjs().year() == year &&
                    dayjs().date() == date
                  const isCurrent =
                    dayjs(currentDate).year() == year &&
                    dayjs(currentDate).date() == date &&
                    dayjs(currentDate).month() == month
                  const isPast =
                    new Date(dayjs().year(), dayjs().month(), dayjs().date()) >
                    new Date(year, month, date)
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
                        onClick={() =>
                          onDateChange(new Date(year, month, date))
                        }
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
      </div>
    </>
  )
}
