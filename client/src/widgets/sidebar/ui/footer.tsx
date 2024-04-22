import { RouteInstance, RouteParams } from "atomic-router"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Container } from "@/shared/ui/general/container"
import { Tooltip } from "@/shared/ui/general/tooltip"
import { Icon, IconName } from "@/shared/ui/icon"

type Config = {
  title: string | any
  type: "button" | "link"
  onClick?: () => void
  route?: RouteInstance<RouteParams> | any
  iconName: IconName
}[]
export const SidebarFooter = ({ config }: { config: Config }) => {
  const { t } = useTranslation()
  return (
    <Container className="flex gap-2 border-t-[1px] border-cBorder text-cIconDefault">
      {config.map(({ title, type, onClick, route, iconName }, id) => {
        return (
          <Tooltip key={id} text={t(title)} dir={id == 0 ? "tr" : "tc"}>
            <Button
              title={t(title)}
              onClick={onClick}
              to={route}
              as={type}
              intent={"primary"}
              size={"xs"}
            >
              <Icon name={iconName} className="text-[24px]" />
            </Button>
          </Tooltip>
        )
      })}
    </Container>
  )
}
