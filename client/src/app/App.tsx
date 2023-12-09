import { Suspense } from "react"

import { Sidebar } from "@/widgets/sidebar"

import { RoutesView } from "@/pages"

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
