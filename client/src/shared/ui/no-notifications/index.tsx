import { useTranslation } from "react-i18next"

import { Typography } from "../general/typography"

export const NoNotifications = ({
  isNotificationListEmpty,
}: {
  isNotificationListEmpty: boolean
}) => {
  const { t } = useTranslation()
  if (!isNotificationListEmpty) return null
  return (
    <div className="text-cIconDefault flex h-full w-full grow flex-col items-center justify-center">
      <Typography.Heading size="lg" className="mb-3">
        {t("noNotifications.title")}
      </Typography.Heading>
      <Typography.Paragraph size="xs">
        {t("noNotifications.description")}
      </Typography.Paragraph>
    </div>
  )
}
