import { useMemo, useState } from "react"

type TaskStatus = "todo" | "in_progress" | "review" | "done" | "overdue"

type NotificationBase = {
  id: string
  date: string
  unread: boolean
}

type TaskNotificationItem = NotificationBase & {
  type: "task_update"
  taskTitle: string
  taskStatus: TaskStatus
  description: string
}

type ProjectInviteNotificationItem = NotificationBase & {
  type: "project_invite"
  projectName: string
  invitedBy: string
}

type NotificationItem = TaskNotificationItem | ProjectInviteNotificationItem

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> =
  {
    todo: {
      label: "Todo",
      className: "bg-cTimeIntervalLow text-cOpacitySecondFont border-cBorder",
    },
    in_progress: {
      label: "In progress",
      className: "bg-blue/15 text-blue border-blue/40",
    },
    review: {
      label: "Review",
      className: "bg-purple/15 text-purple border-purple/40",
    },
    done: {
      label: "Done",
      className: "bg-green/15 text-green border-green/40",
    },
    overdue: {
      label: "Overdue",
      className: "bg-red/15 text-red border-red/40",
    },
  }

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n-001",
    type: "project_invite",
    projectName: "Website redesign",
    invitedBy: "Mila",
    date: "Today, 09:12",
    unread: true,
  },
  {
    id: "n-002",
    type: "task_update",
    taskTitle: "Customer issue triage",
    taskStatus: "in_progress",
    description: "Mila assigned this task to you",
    date: "Today, 08:31",
    unread: true,
  },
  {
    id: "n-003",
    type: "task_update",
    taskTitle: "Billing API migration",
    taskStatus: "review",
    description: "Status changed from In progress to Review",
    date: "Yesterday, 19:04",
    unread: false,
  },
  {
    id: "n-004",
    type: "task_update",
    taskTitle: "Polish empty states",
    taskStatus: "todo",
    description: "Ilya commented on this task",
    date: "Yesterday, 16:27",
    unread: true,
  },
  {
    id: "n-005",
    type: "task_update",
    taskTitle: "QA release checklist",
    taskStatus: "done",
    description: "Task has been completed",
    date: "Feb 19, 13:55",
    unread: false,
  },
  {
    id: "n-006",
    type: "task_update",
    taskTitle: "Prepare sprint recap",
    taskStatus: "todo",
    description: "Notification snoozed until Monday 09:00",
    date: "Feb 19, 09:17",
    unread: false,
  },
  {
    id: "n-007",
    type: "task_update",
    taskTitle: "Design handoff docs",
    taskStatus: "review",
    description: "Notification snoozed until tomorrow",
    date: "Feb 18, 20:40",
    unread: false,
  },
  {
    id: "n-008",
    type: "task_update",
    taskTitle: "Update onboarding checklist",
    taskStatus: "done",
    description: "You cleared this notification",
    date: "Feb 17, 10:15",
    unread: false,
  },
]

type CommonNotificationItemProps = {
  isUnread: boolean
  isSelected: boolean
  onSelect: () => void
}

const TaskNotificationItemRow = ({
  notification,
  isUnread,
  isSelected,
  onSelect,
}: CommonNotificationItemProps & { notification: TaskNotificationItem }) => {
  const statusMeta = STATUS_CONFIG[notification.taskStatus]

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full px-4 py-3 text-left transition ${
        isSelected ? "bg-cFocus/30" : "hover:bg-main"
      }`}
    >
      <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto]">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`inline-flex shrink-0 rounded-md border px-2 py-1 text-[11px] font-semibold ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
          <span className="truncate text-sm font-semibold">
            {notification.taskTitle}
          </span>
        </div>

        <p className="text-cOpacitySecondFont truncate text-sm">
          {notification.description}
        </p>

        <div className="text-cOpacitySecondFont flex items-center justify-start gap-2 text-xs lg:justify-end">
          {isUnread && <span className="bg-blue h-2 w-2 rounded-full" />}
          <span>{notification.date}</span>
        </div>
      </div>
    </button>
  )
}

const ProjectInviteNotificationItemRow = ({
  notification,
  isUnread,
  isSelected,
  onSelect,
}: CommonNotificationItemProps & { notification: ProjectInviteNotificationItem }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full px-4 py-3 text-left transition ${
        isSelected ? "bg-cFocus/30" : "hover:bg-main"
      }`}
    >
      <div className="grid grid-cols-1 items-center gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)_auto]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex shrink-0 rounded-md border border-blue/40 bg-blue/15 px-2 py-1 text-[11px] font-semibold text-blue">
            Project invite
          </span>
          <span className="truncate text-sm font-semibold">
            {notification.projectName}
          </span>
        </div>

        <p className="text-cOpacitySecondFont truncate text-sm">
          {notification.invitedBy} invited you to join this project
        </p>

        <div className="text-cOpacitySecondFont flex items-center justify-start gap-2 text-xs lg:justify-end">
          {isUnread && <span className="bg-blue h-2 w-2 rounded-full" />}
          <span>{notification.date}</span>
        </div>
      </div>
    </button>
  )
}

const NotificationItemRow = ({
  notification,
  isUnread,
  isSelected,
  onSelect,
}: CommonNotificationItemProps & { notification: NotificationItem }) => {
  if (notification.type === "project_invite") {
    return (
      <ProjectInviteNotificationItemRow
        notification={notification}
        isUnread={isUnread}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    )
  }

  return (
    <TaskNotificationItemRow
      notification={notification}
      isUnread={isUnread}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  )
}

const InboxNotificationsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [unreadIds, setUnreadIds] = useState<Set<string>>(
    () =>
      new Set(
        NOTIFICATIONS.filter((notification) => notification.unread).map(
          (notification) => notification.id,
        ),
      ),
  )

  const filteredNotifications = useMemo(() => NOTIFICATIONS, [])

  const onSelectNotification = (id: string) => {
    setSelectedId(id)
    setUnreadIds((previous) => {
      if (!previous.has(id)) {
        return previous
      }
      const next = new Set(previous)
      next.delete(id)
      return next
    })
  }

  return (
    <section className="bg-main-dark text-cFont relative h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0" />
      <div className="relative grid h-full grid-rows-[auto_1fr]">
        <header className="border-cBorder bg-main-light/80 border-b px-4 py-4 backdrop-blur-lg sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-x-2">
              <h6 className="text-base font-semibold">Notifications</h6>
            </div>
            <button
              type="button"
              className="bg-cButtonBg rounded-xl px-4 py-2 text-sm font-medium text-white"
              onClick={() => setUnreadIds(new Set())}
            >
              Mark all read
            </button>
          </div>
        </header>

        <div className="min-h-0">
          <main className="min-h-0 overflow-y-auto p-4 sm:p-6">
            <div className="border-cBorder bg-main-light overflow-hidden rounded-xl border">
              {filteredNotifications.length ? (
                <div className="divide-cBorder divide-y">
                  {filteredNotifications.map((notification) => {
                    const isUnread = unreadIds.has(notification.id)
                    const isSelected = selectedId === notification.id

                    return (
                      <NotificationItemRow
                        key={notification.id}
                        notification={notification}
                        isUnread={isUnread}
                        isSelected={isSelected}
                        onSelect={() => onSelectNotification(notification.id)}
                      />
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm font-medium">
                    No notifications in this tab
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}

export default InboxNotificationsPage
