import { TaskDto } from "@/shared/api/task"
import { Task } from "@/shared/ui/task"

export const Tasks = ({
  tasks,
  onChange, 
  onDoubleClick,
  date = false
}: {
    tasks: TaskDto[]
    onChange: () => void, 
    onDoubleClick: () => void,
    date?: boolean
}) => {
  return (
    <div>
      {tasks.map((task) => (
        <Task
          key={task.id}
          data={task}
          onChange={onChange}
          onDoubleClick={onDoubleClick}
          date={date}
        />
      ))}
    </div>
  )
}