import { Suspense } from "react"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import weekday from "dayjs/plugin/weekday"
import isBetween from "dayjs/plugin/isBetween"
import { extend } from "dayjs"

import { RoutesView } from "@/pages"

import { Sidebar } from "@/widgets/sidebar"

extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)
extend(weekday)
extend(isBetween)

function App() {
  return (
    <div className="bg-main flex h-screen w-full">
      <Sidebar />
      <Suspense fallback={null}>
        <RoutesView />
      </Suspense>
    </div>
  )
}

export default App
