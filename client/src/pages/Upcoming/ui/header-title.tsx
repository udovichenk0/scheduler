import { Dayjs } from "dayjs"
import { useTranslation } from "react-i18next"

import {
  LONG_MONTHS_NAMES_PLURAL,
  LONG_WEEKS_NAMES,
} from "@/shared/config/constants"
import { lowerCase } from "@/shared/lib/typography/lower-case"

export const HeaderTitle = ({ date }: { date: Nullable<Dayjs> }) => {
  const { t } = useTranslation()
  if (!date) {
    return <span>{t("task.upcoming")}</span>
  }
  return (
    <>
      <span className="text-cIconDefault">
        {t(LONG_WEEKS_NAMES[date.day()])}&nbsp;
      </span>
      <span>
        {date.date()}&nbsp;
        {lowerCase(t(LONG_MONTHS_NAMES_PLURAL[date.month()]))}&nbsp;
      </span>
      <span className="text-cIconDefault">{date.year()}</span>
    </>
  )
}
