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
    <div className="sticky top-0 p-1 z-50 mb-2 flex items-center justify-end gap-2 bg-main">
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
        className={`focus-visible:ring outline-none rounded-[5px] py-2, px-2 font-bold text-accent ${isCurrentMonth && "opacity-80"}`}
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
