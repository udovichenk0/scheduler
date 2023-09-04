import { useUnit } from "effector-react"
import { useRef, useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { clsx } from "clsx"

import { Layout } from "@/templates/main"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Icon } from "@/shared/ui/icon"
import { Button } from "@/shared/ui/buttons/main-button"

import style from "./style.module.css"
import { AllUpcomingTasks } from "./sections/upcoming-tasks"
import {
  $$deleteTask,
  $selectedDate,
  currentDateSelected,
  $$taskDisclosure,
  $nextDate,
  $tasksByDate,
  $variant,
  variantSelected,
} from "./upcoming.model"
import { TasksByDate } from "./sections/today-tasks"
import { months, weekDays } from "./config"

export const Upcoming = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [selectedTask, selectTask] = useState<Nullable<{ id: string }>>(null)
  const [
    closeTaskTriggered,
    createTaskOpened,
    selectedDate,
    changeDate,
    deleteTask,
    nextDate,
    tasks,
    variant,
    selectVariant,
  ] = useUnit([
    $$taskDisclosure.closeTaskTriggered,
    $$taskDisclosure.createdTaskOpened,
    $selectedDate,
    currentDateSelected,
    $$deleteTask.taskDeleted,
    $nextDate,
    $tasksByDate,
    $variant,
    variantSelected,
  ])
  return (
    <Layout>
      <Layout.Header
        iconName="common/upcoming"
        title={<Title variant={variant} />}
      />
      <Layout.Content
        className="flex flex-col"
        onClick={(e) => onClickOutside(ref, e, closeTaskTriggered)}
      >
        <UpcomingVariantChanger
          setUpcomingVariant={selectVariant}
          variant={variant}
        />
        {variant === "upcoming" ? (
          <AllUpcomingTasks
            nextDate={nextDate}
            selectTask={selectTask}
            selectedTask={selectedTask}
            changeDate={changeDate}
            selectedDate={selectedDate}
            taskRef={ref}
          />
        ) : (
          <TasksByDate
            date={variant}
            tasks={tasks}
            taskRef={ref}
            selectTask={selectTask}
            selectedTask={selectedTask}
          />
        )}
      </Layout.Content>
      <Layout.Footer
        isTaskSelected={!!selectedTask}
        deleteTask={() => selectedTask && deleteTask({ id: selectedTask.id })}
        action={() => createTaskOpened()}
      />
    </Layout>
  )
}
const Title = ({ variant }: { variant: "upcoming" | Dayjs }) => {
  return (
    <div>
      {variant == "upcoming" ? (
        <span>Upcoming</span>
      ) : (
        <div>
          <span className="text-cIconDefault">{weekDays[variant.day()]}, </span>
          <span></span>
          <span>
            {variant.date()}{" "}
            {months[variant.month()].slice(0, 1).toLowerCase() +
              months[variant.month()].slice(1)}{" "}
          </span>
          <span className="text-cIconDefault">{variant.year()}</span>
        </div>
      )}
    </div>
  )
}
function UpcomingVariantChanger({
  setUpcomingVariant,
  variant,
}: {
  setUpcomingVariant: (variant: "upcoming" | Dayjs) => void
  variant: "upcoming" | Dayjs
}) {
  const [week, setWeek] = useState(0)
  const [dayList, sestDayList] = useState(generateDays(week))
  const isWeekSameOrAfter = dayjs(dayList[0]).add(-7, "day").isBefore(dayjs())
  const changeWeek = (week: number) => {
    setWeek(week)
    sestDayList(generateDays(week))
  }

  return (
    <div className="sticky top-0 z-10 flex w-full bg-main">
      <div className="mb-2 flex w-full border-b border-accent/50 px-9 text-cIconDefault">
        <div className="flex">
          <button
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant("upcoming")}
            data-active={variant === "upcoming"}
          >
            <Icon name="common/upcoming" className="text-[21px]" />
          </button>
          <button
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant(dayjs().startOf("day"))}
            data-active={dayjs(variant).isToday()}
          >
            <Icon name="common/outlined-star" className="text-[21px]" />
          </button>
        </div>
        <div className="flex w-full justify-around text-sm">
          {dayList.map((date, id) => {
            return (
              <button
                key={id}
                onClick={() => setUpcomingVariant(date)}
                data-active={date.isSame(variant)}
                className={clsx(
                  style.active,
                  "w-full pb-2 text-sm text-cIconDefault",
                )}
              >
                <span>{weekDays[date.day()].slice(0, 2)}. </span>
                <span className="font-bold">{date.date()}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          disabled={isWeekSameOrAfter}
          onClick={() => changeWeek(week - 1)}
          className="h-7 w-7"
          intent={"primary"}
        >
          <Icon
            name="common/arrow"
            className={`${
              isWeekSameOrAfter ? "text-cIconDefault" : "text-accent"
            } -rotate-90 text-[12px]`}
          />
        </Button>
        <Button
          onClick={() => changeWeek(week + 1)}
          className="h-7 w-7"
          intent={"primary"}
        >
          <Icon
            name="common/arrow"
            className="rotate-90 text-[12px] text-accent"
          />
        </Button>
      </div>
    </div>
  )
}

function generateDays(int = 0) {
  const date: Dayjs[] = []
  const days = Array.from({ length: 7 })
  let count = int * 7 + 1
  days.forEach(() => {
    date.push(dayjs().add(count, "day"))
    count += 1
  })

  return date
}
generateDays()
