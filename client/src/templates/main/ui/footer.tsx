import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

export const Footer = ({
  action,
  isTaskSelected,
  deleteTask,
}: {
  action: () => void
  isTaskSelected: boolean
  deleteTask: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div className="px-2 py-2" onMouseDown={(e) => e.preventDefault()}>
      <Button
        onClick={() => action()}
        intent={"primary"}
        size={"base"}
        className="!text-accent"
      >
        <Icon name="common/plus" className="mr-4" />
        {t("footer.newTask")}
      </Button>
      <Button
        title="Delete"
        disabled={!isTaskSelected}
        onClick={deleteTask}
        intent={"primary"}
        size={"xs"}
      >
        <Icon
          name="common/trash-can"
          className={`text-[20px] ${
            isTaskSelected ? "text-cIconDefault" : "opacity-40"
          }`}
        />
      </Button>
    </div>
  )
}
