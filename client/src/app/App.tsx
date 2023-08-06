import { RouterProvider } from "atomic-router-react"


import { Sidebar } from "@/widgets/sidebar"

import { router } from "@/shared/routing/router"
import { parseCookieValue } from "@/shared/lib/parse-cookie-value"

import { RoutesView } from "@/pages"

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

if (typeof window != "undefined") {
  const theme = parseCookieValue("theme")
  const accent = parseCookieValue("accent")
  if (theme) {
    document.documentElement.setAttribute("data-theme", `${theme}`)
  }
  if (accent) {
    document.documentElement.style.setProperty(
      "--accent",
      `var(--${accent})`,
    )
  }
  if (!theme) {
    document.documentElement.setAttribute("data-theme", "default")
  }
}
export default App
