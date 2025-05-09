import { useState } from "react"

import { getToday } from "@/shared/lib/date"
import { getLater, getNextWeek, getNextWeekend, getTomorrow } from "@/shared/lib/date/get-date"

export const DateShortcutPicker = ({onSetDate}: {onSetDate: (date: Date) => void}) => {
  const [dates] = useState([
    {label: "Today", date: getToday(), expectedTime: getToday().format("ddd")},
    {label: "Later", date: getLater(), expectedTime: getLater().format("h:mm a")},
    {label: "Tomorrow", date: getTomorrow(), expectedTime: getTomorrow().format("ddd")},
    {label: "Next week", date: getNextWeek(), expectedTime: getNextWeek().format("ddd")},
    {label: "Next weekend", date: getNextWeekend(), expectedTime: getNextWeekend().format("D MMM")},
    {label: "2 weeks", date: getToday().add(2, "week"), expectedTime: getToday().add(2, "week").format("D MMM")},
    {label: "4 weeks", date: getToday().add(4, "week"), expectedTime: getToday().add(4, "week").format("D MMM")},
  ])

  return (
    <div className="p-2 border-r-1 border-cBorder">
      {dates.map(({label, date, expectedTime}, id) => {
        return (
          <button key={id} onClick={() => onSetDate(date.toDate())} className="ring-cSecondBorder hover:bg-main-light flex justify-between rounded-md px-3 py-2 focus-visible:ring text-cFont w-full text-sm cursor-pointer">
            <span>{label}</span>
            <span className="text-cOpacitySecondFont">{expectedTime}</span>
          </button>
        )
      })}
    </div>
  )
}