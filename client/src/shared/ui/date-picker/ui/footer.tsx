import { useTranslation } from "react-i18next"

import { Button } from "../../buttons/main-button"

export const Footer = ({
  onCancel,
  onSave,
}: {
  onCancel: () => void
  onSave: () => void
}) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-3 text-primary">
      <Button onClick={onCancel} className="w-full p-[1px] text-[12px]">
        {t("calendar.cancel")}
      </Button>
      <Button
        onClick={onSave}
        intent={"filled"}
        className="w-full p-[1px] text-[12px]"
      >
        {t("calendar.ok")}
      </Button>
    </div>
  )
}
