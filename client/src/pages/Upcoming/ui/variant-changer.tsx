import { clsx } from "clsx"
import { useUnit } from "effector-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Store } from "effector"

import { Task } from "@/entities/task/type.ts"

import { Icon } from "@/shared/ui/icon"
import { Button } from "@/shared/ui/buttons/main-button"
import { SHORT_WEEKS_NAMES } from "@/shared/config/constants"
import { Root } from "@/shared/ui/tab"
import { SDate, getToday, sdate } from "@/shared/lib/date/lib"

import { generateDaysOfWeek } from "../config"

import style from "./style.module.css"

export function UpcomingVariantChanger({
  setUpcomingVariant,
  upcomingDate,
  $tasksByDateKv,
}: {
  setUpcomingVariant: (date: Nullable<SDate>) => void
  upcomingDate: Nullable<SDate>
  $tasksByDateKv: Store<Nullable<Record<string, Task[]>>>
}) {
  const [week, setWeek] = useState(0)
  const [dayList, setDayList] = useState(() => generateDaysOfWeek(week))
  const isWeekSameOrAfter = dayList[0].subDay(6).isBeforeDate(sdate())
  const tasksByDate = useUnit($tasksByDateKv)
  const { t } = useTranslation()
  const changeWeek = (week: number) => {
    setWeek(week)
    setDayList(generateDaysOfWeek(week))
  }
  return (
    <div className="bg-main sticky top-0 z-10 flex w-full">
      <div className="border-accent/50 text-cIconDefault flex w-full border-b px-9">
        <div className="flex">
          <Root.Trigger
            value="upcoming"
            title={t("task.upcoming")}
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant(null)}
            data-active={!upcomingDate}
          >
            <Icon name="common/upcoming" className="text-[21px]" />
          </Root.Trigger>
          <Root.Trigger
            value="date"
            title={t("task.today")}
            className={clsx(style.active, "px-2 pb-2")}
            onClick={() => setUpcomingVariant(getToday())}
            data-active={upcomingDate?.isToday}
          >
            <Icon name="common/outlined-star" className="text-[21px]" />
          </Root.Trigger>
        </div>
        <div className="flex w-full justify-around text-sm">
          {dayList.map((date, id) => {
            const isAnyTask = !!tasksByDate?.[date.format("YYYY-MM-DD")]
            return (
              <Root.Trigger
                value="date"
                key={id}
                onClick={() => setUpcomingVariant(date)}
                data-active={upcomingDate && date.isSameDate(upcomingDate)}
                className={clsx(
                  style.active,
                  "text-cIconDefault relative w-full py-2 text-sm",
                )}
              >
                <span>{t(SHORT_WEEKS_NAMES[date.day]).slice(0, 2)}. </span>
                <span className="mr-1 font-bold">{date.date}</span>
                {isAnyTask && (
                  <span className="after:bg-cIconDefault after:absolute after:top-1/2 after:h-[5px] after:w-[5px] after:-translate-y-1/2 after:rounded-full after:content-['']"></span>
                )}
              </Root.Trigger>
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
  const { t } = useTranslation()
  return (
    <div className="flex gap-2">
      <Button
        disabled={isCurrentWeekOrFuture}
        onClick={() => changeWeek(week - 1)}
        className="h-7 w-7"
        intent={"primary"}
        title={t("prev_week")}
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
        title={t("next_week")}
      >
        <Icon
          name="common/arrow"
          className="text-accent rotate-90 text-[12px]"
        />
      </Button>
    </div>
  )
}
