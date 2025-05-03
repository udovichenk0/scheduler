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
  const isCurrentMonth =
    dayjs().isSame(date, "month") && dayjs().isSame(date, "year")
  return (
    <div className="bg-main sticky top-0 z-50 mb-2 flex items-center justify-end gap-2 p-1">
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
        className={`py-2, text-accent rounded-[5px] px-2 font-bold outline-none focus-visible:ring ${
          isCurrentMonth && "opacity-80"
        }`}
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
