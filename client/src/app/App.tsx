import { Suspense } from "react"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import isYesterday from "dayjs/plugin/isYesterday"
import weekday from "dayjs/plugin/weekday"
import isBetween from "dayjs/plugin/isBetween"
import localizedFormat from "dayjs/plugin/localizedFormat"
import { extend } from "dayjs"

import { Sidebar } from "@/widgets/sidebar/ui.tsx"
import { RoutesView } from "@/pages"

extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)
extend(isYesterday)
extend(weekday)
extend(isBetween)
extend(localizedFormat)

function App() {
  return (
    <div className="bg-main text-cFont flex h-screen w-full">
      <Sidebar />
      <Suspense fallback={null}>
        <RoutesView />
      </Suspense>
    </div>
  )
}

export default App
