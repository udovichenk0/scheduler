import { useTranslation } from "react-i18next"

import { Typography } from "../general/typography"

export const NoTasks = ({ isTaskListEmpty }: { isTaskListEmpty: boolean }) => {
  const { t } = useTranslation()
  if (!isTaskListEmpty) return null
  return (
    <div className="flex h-full w-full grow flex-col items-center justify-center text-cIconDefault">
      <Typography.Heading size="lg" className="mb-3">
        {t("noTasks.title")}
      </Typography.Heading>
      <Typography.Paragraph size="xs">
        {t("noTasks.description")}
      </Typography.Paragraph>
    </div>
  )
}
