import dayjs, { Dayjs } from "dayjs"
import { useUnit } from "effector-react"
import { RefObject, MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import { Store } from "effector"

import { LONG_MONTHS_NAMES, LONG_WEEKS_NAMES } from "@/shared/config/constants"
import { TaskId } from "@/shared/api/task"
import { lowerCase } from "@/shared/lib/typography/lower-case"
import { i18n } from "@/shared/i18n"

import { Content } from "../../ui/date-section/content"
import { SectionRoot } from "../../ui/date-section/root"

import {
  $upcomingYears,
  $remainingDays,
  $remainingMonths,
  $daysListKv,
  $monthsListKv,
} from "./upcoming-tasks.model"

export const AllUpcomingTasks = ({
  $selectedDate,
  changeDate,
  taskRef,
  selectTaskId,
  selectedTaskId,
  $nextDate,
}: {
  $selectedDate: Store<Date>
  changeDate: (date: Date) => void
  taskRef: RefObject<HTMLDivElement>
  selectTaskId: (e: MouseEvent, taskId: Nullable<TaskId>) => void
  selectedTaskId: Nullable<TaskId>
  $nextDate: Store<Date>
}) => {
  const { t } = useTranslation()
  const [
    daysListKv, 
    remainingDays,
    monthsListKv,
    remainingMonths,
    upcomingYears,
    selectedDate, 
    nextDate
  ] = useUnit([
    $daysListKv,
    $remainingDays,
    $monthsListKv,
    $remainingMonths,
    $upcomingYears,
    $selectedDate,
    $nextDate,
  ])

  const isNextDateSelected = remainingMonths.date.isSame(nextDate, "day")
  return (
    <>
      {daysListKv.map(({ tasks, date }) => {
        const isCurrentMonth = dayjs(date).month() == dayjs().month()
        return (
          <SectionRoot key={date.date()}>
            <SectionRoot.Header
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={date.isSame(nextDate, "day")}
            >
              <span>{date.date()} </span>
              {getFormattedDateSuffix(date)}
              {!isCurrentMonth &&
                lowerCase(t(LONG_MONTHS_NAMES[dayjs(date).month()]))}
              <span>{lowerCase(t(LONG_WEEKS_NAMES[date.day()]))}</span>
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
    <SectionRoot>
      <SectionRoot.Header
        action={() => changeDate(new Date(remainingDays.date.toISOString()))}
        isNextSelectedTask={remainingDays.date.isSame(nextDate, "day")}
      >
        <span>
          {remainingDays.isLastDate ? (
            <>
              <span className="mr-1">{remainingDays.date.date()}</span>
              <span>
                {lowerCase(t(LONG_WEEKS_NAMES[remainingDays.date.day()]))}
              </span>
            </>
          ) : (
            <>
              <span className="mr-1">
                {lowerCase(t(LONG_MONTHS_NAMES[remainingDays.date.month()]))}
              </span>
              <span>
                {remainingDays.dateRange.start}
                {"\u2013"}
                {remainingDays.dateRange.end}
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
        tasks={remainingDays.tasks}
      />
    </SectionRoot>
      {monthsListKv.map(({ tasks, date }) => {
        const isNextDateSelected = date.isSame(nextDate, "day")
        return (
          <SectionRoot key={date.month()}>
            <SectionRoot.Header
              action={() => changeDate(new Date(date.toISOString()))}
              isNextSelectedTask={isNextDateSelected}
            >
              <span>{lowerCase(t(LONG_MONTHS_NAMES[date.month()]))}</span>
            </SectionRoot.Header>
            <SectionRoot.Content
              selectedTaskId={selectedTaskId}
              selectTaskId={selectTaskId}
              isSelected={date.isSame(selectedDate, "day")}
              taskRef={taskRef}
              tasks={tasks}
            />
          </SectionRoot>
        )
      })}
    <SectionRoot key={remainingMonths.date.date()}>
      <SectionRoot.Header
        action={() => changeDate(new Date(remainingMonths.date.toISOString()))}
        isNextSelectedTask={isNextDateSelected}
      >
        {remainingMonths.isLastMonth ? (
          <span>
            {lowerCase(t(LONG_MONTHS_NAMES[remainingMonths.startDate]))}
          </span>
        ) : (
          <span>{`${lowerCase(
            t(LONG_MONTHS_NAMES[remainingMonths.startDate]),
          )}\u2013${lowerCase(
            t(LONG_MONTHS_NAMES[remainingMonths.endDate]),
          )}`}</span>
        )}
      </SectionRoot.Header>
      <SectionRoot.Content
        selectedTaskId={selectedTaskId}
        selectTaskId={selectTaskId}
        taskRef={taskRef}
        isSelected={remainingMonths.date.isSame(selectedDate, "day")}
        tasks={remainingMonths.tasks}
      />
    </SectionRoot>
      {upcomingYears.map(({year, tasks}) => {
        return (
          <SectionRoot key={year}>
            <SectionRoot.Header
              isNextSelectedTask={dayjs().year(+year).isSame(nextDate, "year")}
              action={() =>
                changeDate(
                  new Date(dayjs().year(+year).startOf("year").toISOString()),
                )
              }
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
function getFormattedDateSuffix(date: Dayjs) {
  if (date.isToday()) {
    return lowerCase(i18n.t("date.today"))
  } else if (date.isTomorrow()) {
    return lowerCase(i18n.t("date.tomorrow"))
  }
}