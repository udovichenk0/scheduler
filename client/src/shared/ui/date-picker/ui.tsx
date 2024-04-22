import dayjs, { Dayjs } from "dayjs"
import { Fragment, useEffect, useRef, useState } from "react"

import { addLeadingZero } from "@/shared/lib/date/add-leading-zero"

import { Cell } from "./ui/calendar-cell"
import { WeeksName } from "./ui/week-names"
import { SectionRow, generateCalendar, sub, sum } from "./lib"
import { Footer } from "./ui/footer"

export function DatePicker({
  currentDate,
  onDateChange,
  onCancel,
  onSave,
}: {
  currentDate: Date
  onDateChange: (date: Date) => void
  onCancel: () => void
  onSave: () => void
}) {
  const [calendars, setCalendars] = useState(generateCalendar)
  const [weeksCount, setWeeksCount] = useState(5)
  const [top, setTop] = useState(0)
  const endTarget = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const startTarget = useRef<HTMLDivElement>(null)

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
    <div className="p-3">
      <div className="relative mb-4">
        <WeeksName />
        <div className="overflow-auto">
          <div ref={root} className="noScroll h-[240px] overflow-y-scroll">
            <ul
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
                    <Calendar
                      rows={rows}
                      sectionDate={date}
                      onDateChange={onDateChange}
                      currentDate={currentDate}
                    />
                    {id == calendars.length - 1 && <div ref={endTarget}></div>}
                  </Fragment>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <Footer onCancel={onCancel} onSave={onSave} />
    </div>
  )
}
const Calendar = ({
  rows,
  onDateChange,
  currentDate,
  sectionDate,
}: {
  rows: SectionRow[]
  onDateChange: (date: Date) => void
  currentDate: Date
  sectionDate: Dayjs
}) => {
  return (
    <div className="relative">
      <div className="absolute left-[30%] top-[50%] -z-[10] flex h-[50px] items-center text-[90px] font-bold text-main opacity-10 invert">
        {addLeadingZero(sectionDate.month() + 1)}
      </div>
      {rows.map((row, rowId) => {
        return (
          <li className="flex justify-around" key={rowId}>
            {row.map((cellDate, id) => {
              const isTopDateBigger =
                rowId != rows.length - 1 &&
                rows[rowId][id].date > rows[rowId + 1][id].date
              const isLeftDateBigger =
                id != row.length - 1 &&
                rows[rowId][id].date > rows[rowId][id + 1].date
              const isBottomDateBigger =
                !rows[rowId - 1] && rows[rowId][id].date <= 7

              return (
                <div
                  className={`h-[40px] w-full border-cBorder py-[2px] 
                    ${isBottomDateBigger && "border-t-[1px]"} 
                    ${isTopDateBigger && "border-b-[1px]"} 
                    ${isLeftDateBigger && "border-b-[1px] border-r-[1px]"}`}
                  key={`${cellDate.date}/${cellDate.month}/${cellDate.year}`}
                >
                  <Cell
                    onDateChange={onDateChange}
                    cellDate={cellDate}
                    currentDate={currentDate}
                  />
                </div>
              )
            })}
          </li>
        )
      })}
    </div>
  )
}
