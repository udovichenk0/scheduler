import dayjs from "dayjs"
import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

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
    <div className="sticky top-0 z-50 mb-2 flex items-center justify-end gap-4 bg-main">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(displayedMonth - 1)}
      >
        <Icon
          name="common/arrow"
          className={`-rotate-90 ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs().month())}
        disabled={isCurrentMonth}
        className={`font-bold text-accent ${isCurrentMonth && "opacity-80"}`}
      >
        {t("calendar.today")}
      </button>
      <Button
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(displayedMonth + 1)}
      >
        <Icon name="common/arrow" className="rotate-90" />
      </Button>
    </div>
  )
}
