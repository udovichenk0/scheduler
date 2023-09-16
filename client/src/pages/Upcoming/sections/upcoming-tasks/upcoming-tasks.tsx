import dayjs from "dayjs"
import { useUnit } from "effector-react"
import { RefObject } from "react"

import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"
import { TaskId } from "@/shared/api/task"

import {
  generateRemainingDaysOfMonth,
  generateRemainingMonthsOfYear,
} from "../../config"
import { Content } from "../../ui/date-section/content"
import { SectionRoot } from "../../ui/date-section/root"

import {
  $upcomingTasks,
  $upcomingYears,
  $remainingDays,
  $remainingMonths,
} from "./upcoming-tasks.model"

export const AllUpcomingTasks = ({
  selectedDate,
  changeDate,
  taskRef,
  selectTaskId,
  selectedTaskId,
  nextDate,
}: {
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
  taskRef: RefObject<HTMLDivElement>
  selectTaskId: (task: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  nextDate: Date
}) => {


  return (
    <>
      <DateSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={taskRef}
        nextDate={nextDate}
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
      />
      <RestDateSectionTasklist
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={taskRef}
        nextDate={nextDate}
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
      />
      <MonthSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={taskRef}
        nextDate={nextDate}
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
      />
      <RestMonthSectionTasklist
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={taskRef}
        nextDate={nextDate}
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
      />

      <YearSectionTaskList
        selectedDate={selectedDate}
        changeDate={changeDate}
        taskRef={taskRef}
        nextDate={nextDate}
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
      />
    </>
  )
}

const DateSectionTaskList = ({
  selectedTaskId,
  nextDate,
  selectTaskId,
  taskRef,
  selectedDate,
  changeDate,
}: {
  selectedTaskId: Nullable<TaskId>
  nextDate: Date
  selectTaskId: (task: Nullable<TaskId>) => void
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
          <SectionRoot key={date.date()}>
            <SectionRoot.Header 
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={date.isSame(nextDate, 'day')}
              >
              <span className="space-x-1">
                <span>{date.date()}</span>
                {!isCurrentMonth && (
                  <span>LONG_MONTHS_NAMES[dayjs(date).month()]</span>
                )}
                <span>
                  {date.isToday()
                    ? "Today"
                    : date.isTomorrow()
                    ? "Tomorrow"
                    : ""}
                </span>
                <span>{LONG_WEEKS_NAMES[date.day()]}</span>
              </span>
            </SectionRoot.Header>
            <SectionRoot.Content
              selectedTaskId={selectedTaskId}
              selectTaskId={selectTaskId}
              taskRef={taskRef}
              isSelected={date.isSame(selectedDate, "day")}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    </>
  )
}

const RestDateSectionTasklist = ({
  selectedTaskId,
  selectTaskId,
  taskRef,
  nextDate,
  selectedDate,
  changeDate,
}: {
  selectedTaskId: Nullable<TaskId>
  selectTaskId: (task: Nullable<TaskId>) => void
  taskRef: RefObject<HTMLDivElement>
  nextDate: Date
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const remainingDays = useUnit($remainingDays)
  return (
    <SectionRoot>
      <SectionRoot.Header
        action={() => changeDate(new Date(remainingDays.date.toISOString()))}
        isNextSelectedTask={remainingDays.date.isSame(nextDate, "day")}
      >
        <span>
          {remainingDays.isLastDate ? (
            <>
              <span className="mr-1">{remainingDays.date.date()}</span>
              <span>{LONG_WEEKS_NAMES[remainingDays.date.day()]}</span>
            </>
          ) : (
            <>
              <span className="mr-1">
                {LONG_MONTHS_NAMES[remainingDays.date.month()]}
              </span>
              <span>
                {remainingDays.firstDay}
                {"\u2013"}
                {remainingDays.lastDay}
              </span>
            </>
          )}
        </span>
      </SectionRoot.Header>
      <SectionRoot.Content
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
        isSelected={remainingDays.date.isSame(selectedDate, "day")}
        taskRef={taskRef}
        tasks={remainingDays.restTasks}
      />
    </SectionRoot>
  )
}

const MonthSectionTaskList = ({
  selectedTaskId,
  selectTaskId,
  taskRef,
  nextDate,
  selectedDate,
  changeDate,
}: {
  selectedTaskId: Nullable<TaskId>
  selectTaskId: (task: Nullable<TaskId>) => void
  taskRef: RefObject<HTMLDivElement>
  nextDate: Date
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
        const isNextDateSelected = date.isSame(nextDate, "day")
        return (
          <SectionRoot key={date.month()}>
            <SectionRoot.Header 
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={isNextDateSelected}
            >
              <span>{LONG_MONTHS_NAMES[date.month()]}</span>
            </SectionRoot.Header>
            <SectionRoot.Content
              selectedTaskId={selectedTaskId}
              selectTaskId={selectTaskId}
              isSelected={date.isSame(selectedDate, "day")}
              title={<span>{LONG_MONTHS_NAMES[date.month()]}</span>}
              taskRef={taskRef}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    </>
  )
}

const RestMonthSectionTasklist = ({
  selectedTaskId,
  selectTaskId,
  taskRef,
  nextDate,
  selectedDate,
  changeDate,
}: {
  selectedTaskId: Nullable<TaskId>
  selectTaskId: (task: Nullable<TaskId>) => void
  taskRef: RefObject<HTMLDivElement>
  nextDate: Date
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const remainingMonths = useUnit($remainingMonths)
  const isNextDateSelected = remainingMonths.date.isSame(nextDate, "day")
  return (
    <SectionRoot key={remainingMonths.date.date()}>
      <SectionRoot.Header
        action={() => changeDate(new Date(remainingMonths.date.toISOString()))}
        isNextSelectedTask={isNextDateSelected}
      >
        {
          remainingMonths.isLastMonth ? (
            <span>{LONG_MONTHS_NAMES[remainingMonths.startDate]}</span>
          ) : (
            <span>{`${LONG_MONTHS_NAMES[remainingMonths.startDate]}\u2013${
              LONG_MONTHS_NAMES[remainingMonths.endDate]
            }`}</span>
          )
        }
      </SectionRoot.Header>
      <SectionRoot.Content
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
        taskRef={taskRef}
        isSelected={remainingMonths.date.isSame(selectedDate, "day")}
        tasks={remainingMonths.restTasks}
      />
    </SectionRoot>
  )
}

const YearSectionTaskList = ({
  selectedTaskId,
  selectTaskId,
  taskRef,
  nextDate,
  selectedDate,
  changeDate,
}: {
  selectedTaskId: Nullable<TaskId>
  selectTaskId: (task: Nullable<TaskId>) => void
  taskRef: RefObject<HTMLDivElement>
  nextDate: Date
  selectedDate: Nullable<Date>
  changeDate: (date: Date) => void
}) => {
  const upcomingYears = useUnit($upcomingYears)
  return (
    <>
      {Object.entries(upcomingYears).map(([year, tasks]) => {
        return (
          <SectionRoot key={year}>
            <SectionRoot.Header
              isNextSelectedTask={dayjs().year(+year).isSame(nextDate, "year")}
              action={() =>
                changeDate(
                  new Date(dayjs().year(+year).startOf("year").toISOString()),
                )}
            >
              <span>{year}</span>
            </SectionRoot.Header>
            <Content
              selectedTaskId={selectedTaskId}
              selectTaskId={selectTaskId}
              isSelected={dayjs()
                .year(+year)
                .startOf("year")
                .isSame(selectedDate, "day")}
              taskRef={taskRef}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    </>
  )
}

//! do something with isNextDateSelected(???)
