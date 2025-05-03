import dayjs from "dayjs"
import { useRef, useState, useEffect } from "react"
import { Fragment } from "react/jsx-runtime"

import { addLeadingZero } from "@/shared/lib/date"

import { generateCalendar, sum, sub } from "../lib"

import { Cell } from "./calendar-cell"
import { WeeksName } from "./week-names"
import { Footer } from "./footer"

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
  
  const [calendars, setCalendars] = useState(generateCalendar)
  const [top, setTop] = useState(0)
  const [weeksCount, setWeeksCount] = useState(5)

  const endObserver = new IntersectionObserver(
    (elem) => {
      if (elem[0].isIntersecting) {
        const newCalendars = generateCalendar(dayjs().add(weeksCount, "month"))
        const calendarsLength = newCalendars.length
        setWeeksCount(sum(calendarsLength))
        if (weeksCount >= 20) {
          setTop(sum(calendarsLength))
          setCalendars((prev) =>
            prev.concat(newCalendars).slice(calendarsLength),
          )
        } else {
          setCalendars((prev) => prev.concat(newCalendars))
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
          dayjs().add(weeksCount - 25, "month"),
        )
        const calendarsLength = newCalendars.length
        if (weeksCount > 20) {
          setTop(sub(calendarsLength))
          setWeeksCount(sub(calendarsLength))
          setCalendars((prev) => {
            const n = newCalendars.concat(prev)
            return n.slice(0, n.length - newCalendars.length)
          })
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
  }, [weeksCount])

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
                height: calendars.length * 160,
                position: "relative",
                top: top * 160,
              }}
            >
              {calendars.map(({ rows, date }, id) => {
                return (
                  <Fragment key={id}>
                    {id == 1 && <div ref={startTarget}></div>}
                    <div className="relative">
                      <div className="text-main absolute left-[30%] top-[50%] -z-[10] flex h-[50px] items-center text-[90px] font-bold opacity-10 invert">
                        {addLeadingZero(date.month() + 1)}
                      </div>
                      {rows.map((row, rowId) => {
                        return (
                          <li className="flex justify-around" key={rowId}>
                            {row.map((cellDate) => {
                              return (
                                <div
                                  className={`border-cBorder h-[40px] w-full py-[2px]`}
                                  key={`${cellDate.date}/${cellDate.month}/${cellDate.year}`}
                                >
                                  <Cell
                                    onDateChange={onChange}
                                    cellDate={new Date(
                                      cellDate.year,
                                      cellDate.month,
                                      cellDate.date,
                                    )}
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
                    {id == calendars.length - 1 && <div ref={endTarget}></div>}
                  </Fragment>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <Footer 
      onCancel={onCancel} 
      onSave={onClose}/>
    </div>
  )
}
