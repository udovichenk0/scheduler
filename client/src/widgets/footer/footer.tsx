import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { TaskId } from "@/shared/api/task"

export const Footer = ({
  onCreateTask,
  selectedTaskId,
  onDeleteTask,
}: {
  onCreateTask?: () => void
  selectedTaskId: Nullable<TaskId>
  onDeleteTask: (selectedTaskId: TaskId) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className="h-14 p-2" onMouseDown={(e) => e.preventDefault()}>
      <Button
        onClick={onCreateTask}
        disabled={!onCreateTask}
        intent={"primary"}
        size={"base"}
        className={`!text-accent ${!onCreateTask && "opacity-40"}`}
      >
        <Icon name="common/plus" className="mr-4" />
        {t("footer.newTask")}
      </Button>
      <Button
        title={t("delete")}
        disabled={!selectedTaskId}
        onClick={() => onDeleteTask(selectedTaskId!)}
        intent={"primary"}
        size={"xs"}
      >
        <Icon
          name="common/trash-can"
          className={`text-[20px] ${
            selectedTaskId ? "opacity-70" : "opacity-40"
          }`}
        />
      </Button>
    </div>
  )
}
