import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"

import {
  generateRemainingDaysOfMonth,
  weekDays,
  months,
  generateRemainingMonthsOfYear,
} from "../../config"
import { TasksSection } from "../../ui/date-section"

import {
  $upcomingTasks,
  $upcomingYears,
  $remainingDays,
  $remainingMonths,
} from "./tasks.model"

export const AllUpcomingTasks = ({
  selectedDate,
  changeDate,
  outRef,
  selectTask,
  selectedTask,
}: {
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
  outRef: RefObject<HTMLDivElement>
  selectTask: (task: Nullable<{ id: number }>) => void
  selectedTask: Nullable<{ id: number }>
}) => {
  return (
    <>
      <DateSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />
      <RestDateSectionTasklist
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />
      <MonthSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />
      <RestMonthSectionTasklist
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />

      <YearSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={outRef}
        selectedTask={selectedTask}
        selectTask={selectTask}
      />
    </>
  )
}

const DateSectionTaskList = ({
  selectedTask,
  selectTask,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
  taskRef: RefObject<HTMLDivElement>
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const upcomingTasks = useUnit($upcomingTasks)
  return (
    <>
      {generateRemainingDaysOfMonth().map((date) => {
        const year = dayjs(date).format("YYYY")
        const tasks = upcomingTasks[year]?.filter(({ start_date }) => {
          return (
            dayjs(start_date).isSame(date, "date") &&
            dayjs(start_date).isSame(date, "month")
          )
        })
        const isCurrentMonth = dayjs(date).month() == dayjs().month()
        return (
          <TasksSection
            key={date.date()}
            selectedTask={selectedTask}
            selectTask={selectTask}
            outRef={taskRef}
            action={() => changeDate(new Date(date.toISOString()))}
            isSelected={date.isSame(selectedDate, "day")}
            title={
              <span className="space-x-1">
                <span>{date.date()}</span>
                <span>{!isCurrentMonth && months[dayjs(date).month()]}</span>
                <span>
                  {date.isToday()
                    ? "Today"
                    : date.isTomorrow()
                    ? "Tomorrow"
                    : ""}
                </span>
                <span>{weekDays[date.day()]}</span>
              </span>
            }
            tasks={tasks}
          />
        )
      })}
    </>
  )
}

const RestDateSectionTasklist = ({
  selectedTask,
  selectTask,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
  taskRef: RefObject<HTMLDivElement>
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const remainingDays = useUnit($remainingDays)
  return (
    <TasksSection
      selectedTask={selectedTask}
      selectTask={selectTask}
      action={() => changeDate(new Date(remainingDays.date.toISOString()))}
      isSelected={remainingDays.date.isSame(selectedDate, "day")}
      title={
        <span>
          {remainingDays.isLastDate ? (
            <>
              <span className="mr-1">{remainingDays.date.date()}</span>
              <span>{weekDays[remainingDays.date.day()]}</span>
            </>
          ) : (
            <>
              <span className="mr-1">{months[remainingDays.date.month()]}</span>
              <span>
                {remainingDays.firstDay}
                {"\u2013"}
                {remainingDays.lastDay}
              </span>
            </>
          )}
        </span>
      }
      outRef={taskRef}
      tasks={remainingDays.restTasks}
    />
  )
}

const MonthSectionTaskList = ({
  selectedTask,
  selectTask,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
  taskRef: RefObject<HTMLDivElement>
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const upcomingTasks = useUnit($upcomingTasks)
  return (
    <>
      {generateRemainingMonthsOfYear().map((date) => {
        const year = dayjs(date).format("YYYY")
        const tasks = upcomingTasks[year]?.filter(({ start_date }) => {
          return (
            dayjs(start_date).isSame(date, "month") &&
            dayjs(start_date).isSame(date, "year")
          )
        })
        return (
          <TasksSection
            selectedTask={selectedTask}
            selectTask={selectTask}
            key={date.month()}
            action={() => changeDate(new Date(date.toISOString()))}
            isSelected={date.isSame(selectedDate, "day")}
            title={<span>{months[date.month()]}</span>}
            outRef={taskRef}
            tasks={tasks}
          />
        )
      })}
    </>
  )
}

const RestMonthSectionTasklist = ({
  selectedTask,
  selectTask,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
  taskRef: RefObject<HTMLDivElement>
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const remainingMonths = useUnit($remainingMonths)
  return (
    <TasksSection
      selectedTask={selectedTask}
      selectTask={selectTask}
      title={
        remainingMonths.isLastMonth ? (
          <span>{months[remainingMonths.startDate]}</span>
        ) : (
          <span>{`${months[remainingMonths.startDate]}\u2013${
            months[remainingMonths.endDate]
          }`}</span>
        )
      }
      action={() => changeDate(new Date(remainingMonths.date.toISOString()))}
      outRef={taskRef}
      isSelected={remainingMonths.date.isSame(selectedDate, "day")}
      tasks={remainingMonths.restTasks}
    />
  )
}

const YearSectionTaskList = ({
  selectedTask,
  selectTask,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTask: Nullable<{ id: number }>
  selectTask: (task: Nullable<{ id: number }>) => void
  taskRef: RefObject<HTMLDivElement>
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const upcomingYears = useUnit($upcomingYears)
  return (
    <>
      {Object.entries(upcomingYears).map(([year, tasks]) => {
        return (
          <TasksSection
            selectedTask={selectedTask}
            selectTask={selectTask}
            key={year}
            title={<span>{year}</span>}
            action={() =>
              changeDate(
                new Date(dayjs().year(+year).startOf("year").toISOString()),
              )
            }
            isSelected={dayjs()
              .year(+year)
              .startOf("year")
              .isSame(selectedDate, "day")}
            outRef={taskRef}
            tasks={tasks}
          />
        )
      })}
    </>
  )
}
