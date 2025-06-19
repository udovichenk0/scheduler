import { useState } from "react"

import {
  SDate,
  getLater,
  getNextWeek,
  getNextWeekend,
  getToday,
  getTomorrow,
} from "@/shared/lib/date/lib"

export const DateShortcutPicker = ({
  onSetDate,
}: {
  onSetDate: (date: SDate) => void
}) => {
  const [dates] = useState([
    {
      label: "Today",
      date: getToday(),
      expectedTime: getToday().format("ddd"),
    },
    {
      label: "Later",
      date: getLater(),
      expectedTime: getLater().format("h:mm a"),
    },
    {
      label: "Tomorrow",
      date: getTomorrow(),
      expectedTime: getTomorrow().format("ddd"),
    },
    {
      label: "Next week",
      date: getNextWeek(),
      expectedTime: getNextWeek().format("ddd"),
    },
    {
      label: "Next weekend",
      date: getNextWeekend(),
      expectedTime: getNextWeekend().format("D MMM"),
    },
    {
      label: "2 weeks",
      date: getToday().addWeek(2),
      expectedTime: getToday().addWeek(2).format("D MMM"),
    },
    {
      label: "4 weeks",
      date: getToday().addWeek(4),
      expectedTime: getToday().addWeek(4).format("D MMM"),
    },
  ])

  return (
    <div className="border-r-1 border-cBorder p-2">
      {dates.map(({ label, date, expectedTime }, id) => {
        return (
          <button
            key={id}
            onClick={() => onSetDate(date)}
            className="ring-cSecondBorder hover:bg-main-light text-cFont flex w-full cursor-pointer justify-between rounded-md px-3 py-2 text-sm focus-visible:ring"
          >
            <span>{label}</span>
            <span className="text-cOpacitySecondFont">{expectedTime}</span>
          </button>
        )
      })}
    </div>
  )
}
