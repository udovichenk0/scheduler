import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { SDate, sdate } from "@/shared/lib/date/lib"

export const MonthSwitcher = ({
  changeMonth,
  date,
}: {
  changeMonth: (date: SDate) => void
  date: SDate
}) => {
  const { t } = useTranslation()
  const isCurrentMonth = date.isSameMonth(sdate())
  return (
    <div className="bg-main sticky top-0 z-50 mb-2 flex items-center justify-end gap-2 p-1">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(date.subMonth(1))}
      >
        <Icon
          name="common/arrow"
          className={`-rotate-90 ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(sdate())}
        disabled={isCurrentMonth}
        className={`py-2, text-accent rounded-[5px] px-2 font-bold outline-none focus-visible:ring ${
          isCurrentMonth && "opacity-80"
        }`}
      >
        {t("calendar.today")}
      </button>
      <Button
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(date.addMonth(1))}
      >
        <Icon name="common/arrow" className="rotate-90" />
      </Button>
    </div>
  )
}
