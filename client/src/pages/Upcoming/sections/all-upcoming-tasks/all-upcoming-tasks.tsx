import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"
import { remainingDaysOfMonth, weekDays, months, remainingMonthsOfYear } from "../../config"
import { DateSection } from "../../ui/date-section"
import { $upcomingTasks, $upcomingYears, $restDates, $restMonths } from "./tasks.model"

export const AllUpcomingTasks = ({
  outRef
}:{
  outRef: RefObject<HTMLDivElement>
}) => {
  const [
    upcomingTasks,
    upcomingYears,
    restTasks,
    restMonths
  ] = useUnit([
    $upcomingTasks,
    $upcomingYears,
    $restDates,
    $restMonths
  ])
  return (
    <div>
      {!!Object.keys(upcomingTasks).length && remainingDaysOfMonth().map((date) => {
          const year = dayjs(date).format('YYYY')
          const tasks = upcomingTasks[year].filter(({start_date}) => {
            return dayjs(start_date).isSame(date, 'date') && dayjs(start_date).isSame(date, 'month')
          })
          return (
            <div key={date.date()}>
              <DateSection 
              outRef={outRef} 
              title={<div className="flex gap-2">
                <span>{date.date()}</span>
                <span>{weekDays[date.day()]}</span>
                <span>{months[date.month()]}</span>
              </div>}
              tasks={tasks}/>
            </div>
          )
        })}

          {!!restTasks.restTasks?.length && 
          <DateSection 
            title={
            <div>
              <span className="mr-1">{months[restTasks.month]}</span>
              <span>{restTasks.startDate}{"\u2013"}{restTasks.endDate}</span>
            </div>}
            outRef={outRef} 
            tasks={restTasks.restTasks}/>}

        {!!Object.keys(upcomingTasks).length && remainingMonthsOfYear().map((date) => {
          const year = dayjs(date).format('YYYY')
          const tasks = upcomingTasks[year].filter(({start_date}) => {
            return dayjs(start_date).isSame(date, 'month') && dayjs(start_date).isSame(date, 'year')
          })
          return (
            <div key={date.month()}>
              <DateSection 
              title={<span>{months[date.month()]}</span>}
              outRef={outRef} 
              tasks={tasks}/>
            </div>
          )
        })}

        {!!restMonths.restTasks?.length && 
          <DateSection 
            title={<div>{`${months[restMonths.startDate]}\u2013${months[restMonths.endDate]}`}</div>}
            outRef={outRef} 
            tasks={restMonths.restTasks}/>}
            
        {!!Object.values(upcomingYears).length &&
        Object.entries(upcomingYears).map(([year, tasks]) => {
          return (
            <div key={year}>
              <DateSection 
              title={<span>{year}</span>}
              outRef={outRef} 
              tasks={tasks}/>
            </div>           
          )
        })}
    </div>
  )
}