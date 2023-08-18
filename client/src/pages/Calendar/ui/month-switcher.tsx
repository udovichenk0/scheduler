import dayjs from "dayjs"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

export const MonthSwitcher = ({
  changeMonth,
  displayedMonth,
}: {
  changeMonth: (month: number) => void
  displayedMonth: number
}) => {
  const isCurrentMonth = dayjs().month() === displayedMonth
  return (
    <div className="mb-2 flex items-center justify-end gap-4">
      <Button
        disabled={isCurrentMonth}
        intent={"primary"}
        className="h-6 w-6"
        onClick={() => changeMonth(displayedMonth - 1)}
      >
        <Icon
          name="common/arrow"
          className={`rotate-180 ${isCurrentMonth && "opacity-50"}`}
        />
      </Button>
      <button
        onClick={() => changeMonth(dayjs().month())}
        disabled={isCurrentMonth}
        className={`font-bold text-accent ${isCurrentMonth && "opacity-80"}`}
      >
        Today
      </button>
      <Button
        intent={"primary"}
        className="h-7 w-7"
        onClick={() => changeMonth(displayedMonth + 1)}
      >
        <Icon name="common/arrow" className="translate-x-[1px]" />
      </Button>
    </div>
  )
}
