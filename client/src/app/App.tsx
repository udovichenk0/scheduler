import { Suspense } from "react"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isTomorrow from "dayjs/plugin/isTomorrow"
import isToday from "dayjs/plugin/isToday"
import { extend } from "dayjs"


import { RoutesView } from "@/pages"

import { Sidebar } from "@/widgets/sidebar"

extend(isSameOrAfter)
extend(isSameOrBefore)
extend(isTomorrow)
extend(isToday)

function App() {
  return (
    <div className="flex h-screen w-full bg-main">
      <Sidebar />
      <Suspense fallback={null}>
        <RoutesView />
      </Suspense>
    </div>
  )
}

export default App