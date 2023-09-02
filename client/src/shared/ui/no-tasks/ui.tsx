import { Typography } from "../general/typography"

export const NoTasks = ({ isTaskListEmpty }: { isTaskListEmpty: boolean }) => {
  if (!isTaskListEmpty) return null
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center text-cIconDefault">
      <Typography.Heading size="lg" className="mb-3">
        There is nothing here
      </Typography.Heading>
      <Typography.Paragraph size="xs">
        Press + icon to create a new task
      </Typography.Paragraph>
    </div>
  )
}
