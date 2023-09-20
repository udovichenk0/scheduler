import { Suspense } from "react"

import { RoutesView } from "@/pages"

import { Sidebar } from "@/widgets/sidebar"

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
