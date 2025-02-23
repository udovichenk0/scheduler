import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Tooltip } from "@/shared/ui/general/tooltip"

export const Footer = ({
  onCreateTask,
  isTrashDisabled,
  onDeleteTask,
}: {
  onCreateTask?: () => void
  isTrashDisabled: boolean
  onDeleteTask: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div
      className="flex h-14 items-center p-2"
      onMouseDown={(e) => e.preventDefault()}
    >
      <Button
        onClick={onCreateTask}
        disabled={!onCreateTask}
        intent={"accent"}
        size={"base"}
        className={`text-sm ${!onCreateTask && "opacity-40"}`}
      >
        <Icon name="common/plus" className="mr-4 text-lg" />
        {t("footer.newTask")}
      </Button>
      <Tooltip dir="tc" text={t("action.delete")}>
        <Button
          title={t("action.delete")}
          disabled={isTrashDisabled}
          onClick={onDeleteTask}
          intent={"primary"}
          size={"xs"}
        >
          <Icon
            name="common/trash-can"
            className={`text-[24px] ${
              !isTrashDisabled ? "opacity-70" : "opacity-40"
            }`}
          />
        </Button>
      </Tooltip>
    </div>
  )
}
