import dayjs, { Dayjs } from "dayjs"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

export const MonthSwitcher = ({
  changeMonth,
  date,
}: {
  changeMonth: (month: Dayjs) => void
  date: Dayjs
}) => {
  const { t } = useTranslation()
  const isCurrentMonth = dayjs().isSame(date, 'month') && dayjs().isSame(date, "year")
  return (
    <div className="sticky top-0 z-50 mb-2 flex items-center justify-end gap-4 bg-main">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(date.add(-1, "month"))}
      >
        <Icon
          name="common/arrow"
          className={`-rotate-90 ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs())}
        disabled={isCurrentMonth}
        className={`font-bold text-accent ${isCurrentMonth && "opacity-80"}`}
      >
        {t("calendar.today")}
      </button>
      <Button
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(date.add(1, "month"))}
      >
        <Icon name="common/arrow" className="rotate-90" />
      </Button>
    </div>
  )
}
