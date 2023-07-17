import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"
import { remainingDaysOfMonth, weekDays, months, remainingMonthsOfYear } from "../../config"
import { DateSection } from "../../ui/date-section"
import { $upcomingTasks, $upcomingYears, $restDates, $restMonths } from "./tasks.model"

export const AllUpcomingTasks = ({
  outRef,
  selectedDate,
  changeDate
}:{
  outRef: RefObject<HTMLDivElement>,
  selectedDate: Date | null,
  changeDate: (date: Date) => void
}) => {
  const [
    upcomingTasks,
    upcomingYears,
    restTasks,
    restMonths,
  ] = useUnit([
    $upcomingTasks,
    $upcomingYears,
    $restDates,
    $restMonths,
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
              action={() => changeDate(new Date(date.toISOString()))}
              isSelected={date.isSame(selectedDate, 'day') }
              title={<div className="flex gap-2">
                <span>{date.date()}</span>
                <span>{date.isToday() ? "Today" : date.isTomorrow() ? "Tomorrow" : ""}</span>
                <span>{weekDays[date.day()]}</span>
              </div>}
              tasks={tasks}/>
            </div>
          )
        })}

          {!!restTasks.restTasks?.length && 
          <DateSection 
            action={() => changeDate(new Date(restTasks.date.toISOString()))}
            isSelected={restTasks.date.isSame(selectedDate, 'day') }
            title={
            <div>
              <span className="mr-1">{months[restTasks.date.month()]}</span>
              <span>{restTasks.firstDay}{"\u2013"}{restTasks.lastDay}</span>
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
              action={() => changeDate(new Date(date.toISOString()))}
              isSelected={date.isSame(selectedDate, 'day') }
              title={<span>{months[date.month()]}</span>}
              outRef={outRef} 
              tasks={tasks}/>
            </div>
          )
        })}
        {!!restMonths.restTasks?.length && 
          <DateSection 
            title={<div>{`${months[restMonths.startDate]}\u2013${months[restMonths.endDate]}`}</div>}
            action={() => changeDate(new Date(restMonths.date.toISOString()))}
            outRef={outRef} 
            isSelected={restMonths.date.isSame(selectedDate, 'day') }
            tasks={restMonths.restTasks}/>}
        {!!Object.values(upcomingYears).length &&
        Object.entries(upcomingYears).map(([year, tasks]) => {
          return (
            <div key={year}>
              <DateSection 
              title={<span>{year}</span>}
              action={() => changeDate(new Date(dayjs().year(+year).startOf('year').toISOString()))}
              isSelected={dayjs().year(+year).startOf('year').isSame(selectedDate, 'day') }
              outRef={outRef} 
              tasks={tasks}/>
            </div>           
          )
        })}
    </div>
  )
}