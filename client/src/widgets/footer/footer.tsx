import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { TaskId } from "@/shared/api/task"

export const Footer = ({
  action,
  selectedTaskId,
  deleteTask,
}: {
  action: () => void
  selectedTaskId: Nullable<TaskId>
  deleteTask: (selectedTaskId: TaskId) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className="h-14 p-2" onMouseDown={(e) => e.preventDefault()}>
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
        disabled={!selectedTaskId}
        onClick={() => deleteTask(selectedTaskId!)}
        intent={"primary"}
        size={"xs"}
      >
        <Icon
          name="common/trash-can"
          className={`text-[20px] ${
            selectedTaskId ? "text-cIconDefault" : "opacity-40"
          }`}
        />
      </Button>
    </div>
  )
}
