import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { useRef } from "react"
import { MainLayout } from "@/widgets/layouts/main"
import { onClickOutside } from "@/shared/lib/on-click-outside"
import { daysOfCurrentMonth, weekDays, monthsOfCurrentYear, months } from "./config"
import { DateSection } from "./ui/date-section"
import { $restMonths, $restTasks, $upcomingTasks, $upcomingYears, taskModel } from "./upcoming.model"
export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    upcomingTasks,
    upcomingYears,
    restTasks,
    restMonths
  ] = useUnit([
    taskModel.closeTaskTriggered,
    taskModel.createTaskOpened,
    $upcomingTasks,
    $upcomingYears,
    $restTasks,
    $restMonths
  ])
  return (
    <MainLayout 
      action={() => createTaskOpened({ref})} 
      iconName="common/upcoming" title="Upcoming">
       <div className="h-full" onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}>
          {!!Object.keys(upcomingTasks).length && daysOfCurrentMonth().map((date) => {
            const year = dayjs(date).format('YYYY')
            const tasks = upcomingTasks[year].filter(({start_date}) => {
              return dayjs(start_date).isSame(date, 'date') && dayjs(start_date).isSame(date, 'month')
            })
            return (
              <div key={date.date()}>
                <DateSection 
                outRef={ref} 
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
              title={<div><span>{months[restTasks.month]}</span> <span>{restTasks.startDate}-{restTasks.endDate}</span></div>}
              outRef={ref} 
              tasks={restTasks.restTasks}/>}

          {!!Object.keys(upcomingTasks).length && monthsOfCurrentYear().map((date) => {
            const year = dayjs(date).format('YYYY')
            const tasks = upcomingTasks[year].filter(({start_date}) => {
              return dayjs(start_date).isSame(date, 'month') && dayjs(start_date).isSame(date, 'year')
            })
            return (
              <div key={date.month()}>
                <DateSection 
                title={<span>{months[date.month()]}</span>}
                outRef={ref} 
                tasks={tasks}/>
              </div>
            )
          })}
          {!!restMonths.restTasks?.length && 
            <DateSection 
              title={<div>{`${months[restMonths.startDate]}\u2013${months[restMonths.endDate]}`}</div>}
              outRef={ref} 
              tasks={restMonths.restTasks}/>}
          {!!Object.values(upcomingYears).length &&
          Object.entries(upcomingYears).map(([year, tasks]) => {
            return (
              <div key={year}>
                <DateSection 
                title={<span>{year}</span>}
                outRef={ref} 
                tasks={tasks}/>
              </div>           
            )
          })}
      </div>
    </MainLayout>
  )
}
