import { routes } from "@/shared/routing"

import { NotFoundPage } from "./404.page"

export * from "./404.page"

export const InboxRoute = {
  view: NotFoundPage,
  route: routes.notFoundRoute,
}
