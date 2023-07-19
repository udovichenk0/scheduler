import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"
import { remainingDaysOfMonth, weekDays, months, remainingMonthsOfYear } from "../../config"
import { DateSection } from "../../ui/date-section"
import { $upcomingTasks, $upcomingYears, $restDays, $restMonths } from "./tasks.model"

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
    restDays,
    restMonths,
  ] = useUnit([
    $upcomingTasks,
    $upcomingYears,
    $restDays,
    $restMonths,
  ])
  return (
    <div>
      {!!Object.keys(upcomingTasks).length && remainingDaysOfMonth().map((date) => {
          const year = dayjs(date).format('YYYY')
          const tasks = upcomingTasks[year].filter(({start_date}) => {
            return dayjs(start_date).isSame(date, 'date') && dayjs(start_date).isSame(date, 'month')
          })
          const isCurrentMonth = dayjs(date).month() == dayjs().month()
          return (
            <div key={date.date()}>
              <DateSection 
              outRef={outRef} 
              action={() => changeDate(new Date(date.toISOString()))}
              isSelected={date.isSame(selectedDate, 'day') }
              title={<div className="flex gap-1">
                <span>{date.date()}</span>
                <span>{!isCurrentMonth && months[dayjs(date).month()]}</span>
                <span>{date.isToday() ? "Today" : date.isTomorrow() ? "Tomorrow" : ""}</span>
                <span>{weekDays[date.day()]}</span>
              </div>}
              tasks={tasks}/>
            </div>
          )
        })}

          { !!Object.keys(upcomingTasks).length && 
          <DateSection 
            action={() => changeDate(new Date(restDays.date.toISOString()))}
            isSelected={restDays.date.isSame(selectedDate, 'day') }
            title={
            <div>
              {!restDays.restTasks.length ? 
              <div className="flex gap-1">
                <span>{restDays.date.date()}</span>
                <span>{weekDays[restDays.date.day()]}</span>
              </div>
              : <>
                <span className="mr-1">{months[restDays.date.month()]}</span>
                <span>{restDays.firstDay}{"\u2013"}{restDays.lastDay}</span>
              </>
              }
            </div>}
            outRef={outRef} 
            tasks={restDays.restTasks}/>}

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
        {!!Object.keys(upcomingTasks).length && 
          <DateSection 
            title={
              restMonths.restTasks.length ?
            <div>
              {`${months[restMonths.startDate]}\u2013${months[restMonths.endDate]}`}
            </div>
            : <div>
              {months[restMonths.startDate]} 
            </div>  
          }
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