import { Event as EffectorEvent, Store } from "effector"
import { useUnit } from "effector-react"
import { useState, useRef } from "react"

import { capitalizeLetter } from "@/shared/lib/capitalize-first-letter"
import { Checkbox } from "@/shared/ui/buttons/checkbox"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

import { normalizeDate } from "./lib/normalize-date"
import { DateModal } from "./ui/date-modal"
import { TypeModal } from "./ui/type-modal"

type ModifyTaskFormType = {
  $title: Store<string>
  $description: Store<string>
  $status: Store<"FINISHED" | "INPROGRESS">
  $type: Store<"inbox" | "unplaced">
  $startDate: Store<Nullable<Date>>
  statusChanged: EffectorEvent<"FINISHED" | "INPROGRESS">
  descriptionChanged: EffectorEvent<string>
  titleChanged: EffectorEvent<string>
  typeChanged: EffectorEvent<"inbox" | "unplaced">
  dateChanged: EffectorEvent<Date>
}

export const ModifyTaskForm = ({
  modifyTaskModel,
  date = true,
}: {
  modifyTaskModel: ModifyTaskFormType
  date?: boolean
}) => {
  const [
    title,
    description,
    status,
    currentType,
    currentDate,
    changeStatus,
    changeDescription,
    changeTitle,
    changeType,
    changeDate,
  ] = useUnit([
    modifyTaskModel.$title,
    modifyTaskModel.$description,
    modifyTaskModel.$status,
    modifyTaskModel.$type,
    modifyTaskModel.$startDate,
    modifyTaskModel.statusChanged,
    modifyTaskModel.descriptionChanged,
    modifyTaskModel.titleChanged,
    modifyTaskModel.typeChanged,
    modifyTaskModel.dateChanged,
  ])

  const [isTypeOpened, setTypeOpen] = useState(false)
  const [isDatePickerOpened, setDatePickerOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const onChangeType = (payload: "inbox" | "unplaced") => {
    setTypeOpen(false)
    changeType(payload)
  }
  const onChangeDate = (payload: Date) => {
    setDatePickerOpen(false)
    changeDate(payload)
  }
  return (
    <div className="flex w-full gap-2 rounded-[5px] text-cTaskEditDefault">
      <Checkbox
        checked={status == "FINISHED"}
        onChange={() => changeStatus(status)}
      />
      <div className="flex w-full flex-col gap-3">
        <input
          onChange={(e) => changeTitle(e.target.value)}
          value={title}
          placeholder={title ? "" : "New Task"}
          className="w-full bg-transparent text-sm font-medium text-cFont outline-none dark:text-gray-300"
        />
        <input
          className="w-full bg-transparent text-sm text-grey outline-none"
          placeholder={description ? "" : "Note"}
          value={description || ""}
          onChange={(e) => changeDescription(e.target.value)}
        />
        <div className="">
          <div className="flex flex-col gap-1">
            <div>
              <Button
                onClick={() => setTypeOpen((prev) => !prev)}
                size={"sm"}
                intent={"primary"}
              >
                <div className="flex gap-4">
                  <Icon
                    name={"common/inbox"}
                    className="h-[18px] w-[18px] text-accent"
                  />
                  {capitalizeLetter(currentType)}
                </div>
              </Button>
            </div>
            <div className="flex">
              {date && (
                <Button
                  onClick={() => setDatePickerOpen((prev) => !prev)}
                  size={"sm"}
                  intent={"primary"}
                >
                  <span className="flex">
                    <Icon
                      name={"common/upcoming"}
                      className="mr-4 h-[18px] w-[18px] text-cTaskEditDefault"
                    />
                    <span>Date</span>
                    <span className="ml-2 text-accent">
                      {currentDate && normalizeDate(currentDate)}
                    </span>
                  </span>
                </Button>
              )}
            </div>
          </div>
          {isTypeOpened && (
            <TypeModal
              outRef={ref}
              currentType={currentType}
              changeType={onChangeType}
              closeTypeModal={() => setTypeOpen(false)}
            />
          )}
          {isDatePickerOpened && (
            <DateModal
              currentDate={currentDate || new Date()}
              outRef={ref}
              changeDate={onChangeDate}
              closeDatePicker={() => setDatePickerOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
