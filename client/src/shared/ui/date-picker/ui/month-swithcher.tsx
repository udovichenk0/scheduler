import dayjs, { Dayjs } from "dayjs"
import { useTranslation } from "react-i18next"

import { Button } from "../../buttons/main-button"
import { Icon } from "../../icon"

export const MonthSwitcher = ({
  changeMonth,
  date,
}: {
  changeMonth: (date: Dayjs) => void
  date: Dayjs
}) => {
  const { t } = useTranslation()
  const isCurrentDate = dayjs().isSame(date, "month") && dayjs().isSame(date, "year")
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        disabled={isCurrentDate}
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(date.add(-1, 'month'))}
      >
        <Icon
          name="common/arrow"
          className={`-rotate-90 text-[10px] ${isCurrentDate && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs())}
        disabled={isCurrentDate}
        className={`text-[11px] font-bold text-accent ${
          isCurrentDate && "opacity-80"
        }`}
      >
        {t("calendar.today")}
      </button>
      <Button
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(date.add(1, 'month'))}
      >
        <Icon name="common/arrow" className="rotate-90 text-[10px]" />
      </Button>
    </div>
  )
}
