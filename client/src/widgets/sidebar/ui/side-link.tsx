import { RouteInstance, RouteParams } from "atomic-router"
import { Link } from "atomic-router-react"
import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

import { buttonCva } from "@/shared/ui/buttons/main-button"
import { Icon, IconName } from "@/shared/ui/icon"
export const SideLink = ({
  title,
  iconName,
  route,
  rightCount,
}: {
  title: string
  iconName: IconName
  route: RouteInstance<RouteParams>
  rightCount?: number
}) => {
  const { i18n } = useTranslation("myNamespace")
  return (
    <div className="flex w-full cursor-pointer justify-between">
      <Link
        to={route}
        params={{
          lang:
            i18n.language == (i18n.options.fallbackLng as string[])[0]
              ? undefined
              : i18n.language,
        }}
        activeClassName="bg-cFocus pointer-events-none"
        className={clsx(buttonCva({ intent: "primary", size: "sm" }), "w-full")}
      >
        <div className="flex items-center justify-between">
          <div className="jusfity-center flex items-center gap-4">
            <Icon name={iconName} className="h-[20px] w-[20px] fill-accent" />
            {title}
          </div>
          <span className="text-grey">{rightCount}</span>
        </div>
      </Link>
    </div>
  )
}
