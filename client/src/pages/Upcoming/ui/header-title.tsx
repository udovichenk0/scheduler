import { Dayjs } from "dayjs"
import { useTranslation } from "react-i18next"

import {
  LONG_MONTHS_NAMES_PLURAL,
  LONG_WEEKS_NAMES,
} from "@/shared/config/constants"
import { lowerCase } from "@/shared/lib/typography/lower-case"

export const HeaderTitle = ({ variant }: { variant: "upcoming" | Dayjs }) => {
  const { t } = useTranslation()
  if (variant == "upcoming") {
    return <span>{t("task.upcoming")}</span>
  }
  return (
    <>
      <span className="text-cIconDefault">
        {t(LONG_WEEKS_NAMES[variant.day()])}&nbsp;
      </span>
      <span>
        {variant.date()}&nbsp;
        {lowerCase(t(LONG_MONTHS_NAMES_PLURAL[variant.month()]))}&nbsp;
      </span>
      <span className="text-cIconDefault">{variant.year()}</span>
    </>
  )
}
