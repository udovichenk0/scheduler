import { RoutesView } from "@/pages"

import { Sidebar } from "@/widgets/sidebar"

function App() {
  return (
    <div className="flex w-full bg-main">
      <Sidebar />
      <RoutesView />
    </div>
  )
}
export default App
