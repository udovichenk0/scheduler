import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"
import { remainingDaysOfMonth, weekDays, months, remainingMonthsOfYear } from "../../config"
import { DateSection } from "../../ui/date-section"
import { $upcomingTasks, $upcomingYears, $remainingDays, $remainingMonths } from "./tasks.model"

export const AllUpcomingTasks = ({
  selectedDate,
  changeDate,
  outRef 
}:{
  selectedDate: Date | null,
  changeDate: (date: Date) => void,
  outRef: RefObject<HTMLDivElement>
}) => {
  const [
    upcomingTasks,
    upcomingYears,
    remainingDays,
    remainingMonths,
  ] = useUnit([
    $upcomingTasks,
    $upcomingYears,
    $remainingDays,
    $remainingMonths, 
  ])
  return (
    <div>
      {remainingDaysOfMonth().map((date) => {
          const year = dayjs(date).format('YYYY')
          const tasks = upcomingTasks[year]?.filter(({start_date}) => {
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
          <DateSection 
            action={() => changeDate(new Date(remainingDays.date.toISOString()))}
            isSelected={remainingDays.date.isSame(selectedDate, 'day') }
            title={
            <div>
              {remainingDays.isLastDate ? 
              <div className="flex gap-1">
                <span>{remainingDays.date.date()}</span>
                <span>{weekDays[remainingDays.date.day()]}</span>
              </div>
              : <>
                <span className="mr-1">{months[remainingDays.date.month()]}</span>
                <span>{remainingDays.firstDay}{"\u2013"}{remainingDays.lastDay}</span>
              </>
              }
            </div>}
            outRef={outRef} 
            tasks={remainingDays.restTasks}/>

        {remainingMonthsOfYear().map((date) => {
          const year = dayjs(date).format('YYYY')
          const tasks = upcomingTasks[year]?.filter(({start_date}) => {
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
          <DateSection 
              title={
                remainingMonths.isLastMonth?
                <div>
                  {months[remainingMonths.startDate]} 
                </div>  
              : <div>
                {`${months[remainingMonths.startDate]}\u2013${months[remainingMonths.endDate]}`}
              </div>
            }
            action={() => changeDate(new Date(remainingMonths.date.toISOString()))}
            outRef={outRef} 
            isSelected={remainingMonths.date.isSame(selectedDate, 'day') }
            tasks={remainingMonths.restTasks}/>
            
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