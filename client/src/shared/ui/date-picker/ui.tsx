import dayjs, { Dayjs } from "dayjs"
import { Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { addLeadingZero } from "@/shared/lib/date/add-leading-zero"

import { Button } from "../buttons/main-button"

import { Cell } from "./ui/calendar-cell"
import { WeeksName } from "./ui/week-names"



const sum = (a: number) => (b: number) => a + b
const sub = (a: number) => (b: number) => b - a

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
  const [count, setCount] = useState(5)
  const [top, setTop] = useState(0)
  const { t } = useTranslation()
  const endTarget = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const startTarget = useRef<HTMLDivElement>(null)

  const observer = new IntersectionObserver((elem) => {
    if(elem[0].isIntersecting){
      const newCalendars = generateCalendar(dayjs().add(count, 'month'))
      const calendarsLength = newCalendars.length
      setCount(sum(calendarsLength));
      if(count >= 20){
        setTop(sum(calendarsLength))
        setCalendars((prev) => prev.concat(newCalendars).slice(calendarsLength))
      }
      else {
        setCalendars((prev) => prev.concat(newCalendars))
      }
    }
  }, {
    root: root.current,
    threshold: 0
  })
  const startObserver = new IntersectionObserver((elem) => {
    if(elem[0].isIntersecting && top > 0){
      const newCalendars = generateCalendar(dayjs().add(count - 25, 'month'))
      const calendarsLength = newCalendars.length
      if(count > 20){
        setTop(sub(calendarsLength))
        setCount(sub(calendarsLength));
        setCalendars((prev) => {
          const n = newCalendars.concat(prev)
          return n.slice(0, n.length - newCalendars.length)
        })
      }
    }
  }, {
    root: root.current,
    threshold: 0
  })
  useEffect(() => {
    if(endTarget.current && startTarget.current) {
      observer.observe(endTarget.current)
      startObserver.observe(startTarget.current)
    }
    return () => {
      if(endTarget.current && startTarget.current) {
        observer.unobserve(endTarget.current)
        startObserver.unobserve(startTarget.current)
      }
    }
  }, [count])

  return (
    <div className="p-3">
      <div className="relative mb-4">
        <WeeksName />
        <div className="overflow-auto">
          <div ref={root} className="h-[240px] overflow-y-scroll noScroll">
            <ul data-testid="date-list" style={{ height: calendars.length * 160, position: 'relative', top: top * 160 }}>
              {calendars.map(({rows, date}, id) => {
                return (
                  <Fragment key={id}>
                    {id == 1 && (
                      <div ref={startTarget}></div>
                    )}
                    <Calendar calendar={rows} sectionDate={date} onDateChange={onDateChange} currentDate={currentDate}/>
                    {id == calendars.length - 1 && (
                      <div ref={endTarget}></div>
                    )}
                  </Fragment>
                )
              })} 
            </ul>
          </div>
        </div>
      </div>
      <div className="flex gap-3 text-primary">
        <Button onClick={onCancel} className="w-full p-[1px] text-[12px]">
          {t("calendar.cancel")}
        </Button>
        <button
          onClick={onSave}
          className="w-full rounded-[5px] bg-accent/50 p-[1px] text-[12px] duration-150 hover:bg-accent/40"
        >
          {t("calendar.ok")}
        </button>
      </div>
    </div>
  )
}
type SectionRow = {
    date: number;
    month: number;
    year: number;
}[];
const Calendar= ({ 
    calendar,
    onDateChange,
    currentDate,
    sectionDate
  }: { 
    calendar: SectionRow[]
    onDateChange: (date: Date) => void
    currentDate: Date
    sectionDate: Dayjs
  }) => {
  return (
    <div className="relative">
      <div className="absolute left-[30%] top-[50%] -z-[10] flex h-[50px] items-center text-[90px] font-bold text-main opacity-10 invert">
        {addLeadingZero(sectionDate.month() + 1)}
      </div>
      {
        calendar.map((item, rowId) => {
          return (
            <li className="flex justify-around" key={rowId}>
              {item.map(({ date, month, year }, id) => {
                const isTopDateBigger =
                  rowId != calendar.length - 1 &&
                  calendar[rowId][id].date > calendar[rowId + 1][id].date
                const isLeftDateBigger =
                  id != item.length - 1 &&
                  calendar[rowId][id].date > calendar[rowId][id + 1].date
                const isBottomDateBigger = !calendar[rowId-1] && calendar[rowId][id].date <=7

                return (
                  <div
                    className={`h-[40px] w-full border-cBorder py-[2px] 
                    ${isBottomDateBigger && "border-t-[1px]"} 
                    ${isTopDateBigger && "border-b-[1px]"} 
                    ${isLeftDateBigger && "border-b-[1px] border-r-[1px]"}`
                  }
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
            </li>
          )
        })
      }
    </div>
  )
}
type CalendarSections = {
  date: Dayjs,
  rows: SectionRow[]
}[]
const generateCalendar = (date: Dayjs = dayjs()) => {
  const result: CalendarSections = []
  for(let i = 0; i < 5; i++){
    const newDate = date.startOf('month').add(i, 'month')
    const day = newDate.day()
    const startOfTheDate = newDate.add(-day, 'day')
    const endOfTheDate = newDate.endOf('month')
    let row: SectionRow = []
    let rows: SectionRow[] = []

    //           all dates of month + days from the prev month that are on the same row
    const sectionsDatesLength = endOfTheDate.date() + day

    for(let k = 0; k < sectionsDatesLength; k++){
      const d = startOfTheDate.add(k, 'day')
      const date = d.date()
      const month = d.month()
      const year = d.year()
      if(row.length == 7){
        if(row[row.length-1].date > 24){
          rows.push(row)
          row = []
          break;
        }
        rows.push(row)
        row = []
      }
      if(endOfTheDate.date() == date){
        row.push({date,month,year})
        rows.push(row)
        row = []
        break
      }
    }
    result.push({
      date: newDate,
      rows: rows
    })
    rows = []
  }
  return result
}
