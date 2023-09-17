import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { Button } from "../../buttons/main-button"
import { Icon } from "../../icon"

export const MonthSwitcher = ({
  changeMonth,
  displayedMonth,
}: {
  changeMonth: (month: number) => void
  displayedMonth: number
}) => {
  const { t } = useTranslation()
  const isCurrentMonth = dayjs().month() === displayedMonth
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(displayedMonth - 1)}
      >
        <Icon
          name="common/arrow"
          className={`-rotate-90 text-[10px] ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs().month())}
        disabled={isCurrentMonth}
        className={`text-[11px] font-bold text-accent ${
          isCurrentMonth && "opacity-80"
        }`}
      >
        {t("calendar.today")}
      </button>
      <Button
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(displayedMonth + 1)}
      >
        <Icon name="common/arrow" className="rotate-90 text-[10px]" />
      </Button>
    </div>
  )
}
