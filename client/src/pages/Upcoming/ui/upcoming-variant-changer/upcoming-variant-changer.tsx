import { clsx } from "clsx"
import dayjs, { Dayjs } from "dayjs"
import { useUnit } from "effector-react"
import { useState } from "react"

import { Icon } from "@/shared/ui/icon"
import { Button } from "@/shared/ui/buttons/main-button"
import { LONG_WEEKS_NAMES } from "@/shared/config/constants"

import { generateDaysOfWeek } from "../../config"
import { newTaskByDate } from "../../upcoming.model"

import style from "./style.module.css"

export function UpcomingVariantChanger({
  setUpcomingVariant,
  variant,
}: {
  setUpcomingVariant: (variant: "upcoming" | Dayjs) => void
  variant: "upcoming" | Dayjs
}) {
  const [week, setWeek] = useState(0)
  const [dayList, setDayList] = useState(generateDaysOfWeek(week))
  const isWeekSameOrAfter = dayjs(dayList[0]).add(-7, "day").isBefore(dayjs())
  const [tasksByDate] = useUnit([newTaskByDate])
  const changeWeek = (week: number) => {
    setWeek(week)
    setDayList(generateDaysOfWeek(week))
  }
  return (
    <div className="sticky top-0 z-10 flex w-full bg-main">
      <div className="mb-2 flex w-full border-b border-accent/50 px-9 text-cIconDefault">
        <div className="flex">
          <button
            title="Upcoming"
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant("upcoming")}
            data-active={variant === "upcoming"}
          >
            <Icon name="common/upcoming" className="text-[21px]" />
          </button>
          <button
            title="Today"
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant(dayjs().startOf("day"))}
            data-active={dayjs(variant).isToday()}
          >
            <Icon name="common/outlined-star" className="text-[21px]" />
          </button>
        </div>
        <div className="flex w-full justify-around text-sm">
          {dayList.map((date, id) => {
            const isAnyTask = !!tasksByDate[date.format("YYYY-MM-DD")]
            return (
              <button
                key={id}
                onClick={() => setUpcomingVariant(date)}
                data-active={date.isSame(variant)}
                className={clsx(
                  style.active,
                  "relative w-full py-2 text-sm text-cIconDefault",
                )}
              >
                <span>{LONG_WEEKS_NAMES[date.day()].slice(0, 2)}. </span>
                <span className="mr-1 font-bold">{date.date()}</span>
                {isAnyTask && (
                  <span className="after:absolute after:top-1/2 after:h-[5px] after:w-[5px] after:-translate-y-1/2 after:rounded-full after:bg-cIconDefault after:content-['']"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <ArrowsChangers
        changeWeek={changeWeek}
        week={week}
        isCurrentWeekOrFuture={isWeekSameOrAfter}
      />
    </div>
  )
}

const ArrowsChangers = ({
  changeWeek,
  week,
  isCurrentWeekOrFuture,
}: {
  changeWeek: (week: number) => void
  week: number
  isCurrentWeekOrFuture: boolean
}) => {
  return (
    <div className="flex gap-2">
      <Button
        disabled={isCurrentWeekOrFuture}
        onClick={() => changeWeek(week - 1)}
        className="h-7 w-7"
        intent={"primary"}
        title="Previous Week"
      >
        <Icon
          name="common/arrow"
          className={`${
            isCurrentWeekOrFuture ? "text-cIconDefault" : "text-accent"
          } -rotate-90 text-[12px]`}
        />
      </Button>
      <Button
        onClick={() => changeWeek(week + 1)}
        className="h-7 w-7"
        intent={"primary"}
        title="Next Week"
      >
        <Icon
          name="common/arrow"
          className="rotate-90 text-[12px] text-accent"
        />
      </Button>
    </div>
  )
}
