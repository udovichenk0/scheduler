import { TaskId } from "@/shared/api/task/task.dto.ts"

export const ModalName = {
  CreateTaskForm: "create-task-form",
  PriorityPicker: "priority-picker",
  UpdateTaskForm: "update-task-form",
  MoreTasksModal: "calendar/more-tasks-modal",
  SidebarSettingsModal: "sidebar/settings-modal",
  PomodoroSettingsModal: "pomodoro/settings-modal",
  PomodoroModal: "pomodoro-modal",
  TypeModal: "type-modal",
  DateModal: "date-modal",
  TaskFormDateModal: "task-form/date-modal",
  SortModal: "sort-modal",
  UpdateTaskFormById: (id: string) => `update-task-form/${id}`,
  CalendarUpdateTaskForm: (taskId: TaskId) =>
    `calendar/update-task-form/${taskId}`,
  CalendarCreateTaskForm: (date: string) => `calendar/create-task-form/${date}`,
} as const
