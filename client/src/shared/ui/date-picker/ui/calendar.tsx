import dayjs from "dayjs"
import { useRef, useState, useEffect } from "react"
import { Fragment } from "react/jsx-runtime"

import { generateCalendar } from "../lib"

import { Cell } from "./calendar-cell"
import { WeeksName } from "./week-names"
import { Button } from "../../buttons/main-button"
import { useTranslation } from "react-i18next"

export const Calendar = ({
  onChange,
  onCancel,
  onClose,
  tempStartDate,
  tempDueDate,
}: {
  onChange: (date: Date) => void
  onCancel: () => void
  onClose: () => void
  tempStartDate: Nullable<Date>
  tempDueDate: Nullable<Date>
}) => {
  const endTarget = useRef<HTMLDivElement>(null)
  const startTarget = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  
  const [months, setMonths] = useState(generateCalendar)
  const [top, setTop] = useState(0)
  const [monthCount, setMonthCount] = useState(5)

  const endObserver = new IntersectionObserver(
    (elem) => {
      if (elem[0].isIntersecting) {
        const newCalendars = generateCalendar(dayjs().add(monthCount, "month"))
        setMonthCount((prev) => prev + 5)

        if (monthCount >= 20) {
          const newTop = months.slice(0, 5).reduce((acc, {weeks}) => acc + weeks.length ,0)
          setTop((top) => top + newTop)
          setMonths((prev) =>
            prev.concat(newCalendars).slice(5),
          )
        } else {
          setMonths((prev) => prev.concat(newCalendars))
        }
      }
    },
    {
      root: root.current,
      threshold: 0,
    },
  )
  const startObserver = new IntersectionObserver(
    (elem) => {
      if (elem[0].isIntersecting && top > 0) {
        const newCalendars = generateCalendar(
          dayjs().add(monthCount - 25, "month"),
        )
        if (monthCount > 20) {
          const newTop = newCalendars.reduce((acc, {weeks}) => acc + weeks.length, 0)
          setMonths((prev) => newCalendars.concat(prev).slice(0, newCalendars.length))
          setTop((top) => top - newTop)
          setMonthCount(prev => prev - 5)
        }
      }
    },
    {
      root: root.current,
      threshold: 0,
    },
  )
  useEffect(() => {
    if (endTarget.current && startTarget.current) {
      endObserver.observe(endTarget.current)
      startObserver.observe(startTarget.current)
    }
    return () => {
      if (endTarget.current && startTarget.current) {
        endObserver.unobserve(endTarget.current)
        startObserver.unobserve(startTarget.current)
      }
    }
  }, [monthCount])
  return (
    <div className="p-2">
      <div className="relative mb-4">
        <WeeksName />
        <div className="overflow-auto">
          <div ref={root} className="noScroll h-[240px] overflow-y-scroll">
            <ul
              className="px-1"
              data-testid="date-list"
              style={{
                transform: `translateY(${top * 40}px)`
              }}
            >
              {months?.map(({ weeks, date }, id) => {
                return (
                  <Fragment key={id}>
                    {id == 1 && <div ref={startTarget}></div>}
                    <div className="relative">
                      <div className="text-main absolute left-[30%] top-[50%] -translate-y-1/2 -z-[10] flex h-[50px] items-center text-[90px] font-bold opacity-10 invert">
                        {date.format("MM")}
                      </div>
                      {weeks?.map(({dates}, rowId) => {
                        return (
                          <li className="flex justify-around" key={rowId}>
                            {dates.map((date) => {
                              return (
                                <div
                                  className={`border-cBorder h-[40px] w-full py-[2px]`}
                                  key={date.toString()}
                                >
                                  <Cell
                                    onDateChange={onChange}
                                    cellDate={date.toDate()}
                                    startDate={tempStartDate}
                                    dueDate={tempDueDate}
                                  />
                                </div>
                              )
                            })}
                          </li>
                        )
                      })}
                    </div>
                    {id == months.length - 1 && <div ref={endTarget}></div>}
                  </Fragment>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-x-2">
        <Button onClick={onCancel} className="w-full p-[1px] text-[12px]">
          {t("calendar.cancel")}
        </Button>
        <Button
          onClick={onClose}
          intent={"filled"}
          className="w-full p-[1px] text-[12px]"
        >
          {t("calendar.ok")}
        </Button>
      </div>
    </div>
  )
}
