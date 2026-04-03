import { allSettled, fork } from "effector"
import { createRoot } from "react-dom/client"
import { I18nextProvider } from "react-i18next"
import { RouterProvider } from "atomic-router-react"
import { Provider } from "effector-react"

import App from "./app/App"
import "./app/index.css"
import { appInitializer } from "./app/initializer"
import { $$i18n } from "./shared/i18n/i18n.ts"
import { router } from "./shared/routing/router.ts"

const { init } = appInitializer()

const scope = fork()

allSettled(init, { scope })
createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider value={scope}>
    <I18nextProvider i18n={$$i18n.i18n}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </I18nextProvider>
  </Provider>,
)
