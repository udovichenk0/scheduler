import { useState } from "react"

import { getToday } from "@/shared/lib/date"
import { getLater, getNextWeek, getNextWeekend, getTomorrow } from "@/shared/lib/date/get-date"

export const DateShortcutPicker = ({onSetDate}: {onSetDate: (date: Date) => void}) => {
  const [dates] = useState([
    {label: "Today", date: getToday()},
    {label: "Later", date: getLater()},
    {label: "Tomorrow", date: getTomorrow()},
    {label: "Next week", date: getNextWeek()},
    {label: "Next weekend", date: getNextWeekend()},
    {label: "2 weeks", date: getToday().add(2, "week")},
    {label: "4 weeks", date: getToday().add(4, "week")},
  ])

  return (
    <div className="p-2 border-r-1 border-cBorder">
      {dates.map(({label, date}, id) => {
        return (
          <button key={id} onClick={() => onSetDate(date.toDate())} className="ring-cSecondBorder hover:bg-main-light flex rounded-md px-3 py-2 focus-visible:ring text-cFont w-full text-sm cursor-pointer">
            {label}
          </button>
        )
      })}
    </div>
  )
}