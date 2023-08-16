import { RouterProvider } from "atomic-router-react"

import { RoutesView } from "@/pages"

import { Sidebar } from "@/widgets/sidebar"

import { router } from "@/shared/routing/router"

function App() {
  return (
    <RouterProvider router={router}>
      <div className="flex w-full bg-main">
        <Sidebar />
        <RoutesView />
      </div>
    </RouterProvider>
  )
}

export default App
