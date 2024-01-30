import { TaskId } from "@/shared/api/task"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AllTasksModal } from "./all-tasks-modal"
import { Task } from "@/entities/task/task-item"

export const CellFooter = ({ 
  updateTaskOpened,
  showMoreVisible,
  tasks
}: { 
  updateTaskOpened: (taskId: TaskId) => void
  showMoreVisible: boolean,
  tasks?: Task[]
}) => {
  const { t } = useTranslation()

  const [modalState, setModalState] = useState(false)
  return (
    <div className="h-5">
      {showMoreVisible && (
        <button
          onClick={() => setModalState(true)}
          className="w-full text-start text-sm text-cIconDefault hover:text-primary"
        >
          {t("calendar.showAll")}
        </button>
      )}
      <AllTasksModal
        isOpen={modalState}
        onCloseModal={() => setModalState(false)}
        tasks={tasks}
        onTaskUpdate={updateTaskOpened}
      />
    </div>
  ) 
}