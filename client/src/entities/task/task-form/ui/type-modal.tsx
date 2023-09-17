import { useTranslation } from "react-i18next"

import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { BaseModal } from "@/shared/ui/modals/base"

import { $$typeModal } from ".."

const types = [
  { type: "inbox", iconName: "common/inbox" },
  { type: "unplaced", iconName: "common/inbox" },
] as const

export const TypePickerModal = ({
  currentType,
  changeType,
}: {
  currentType: "inbox" | "unplaced"
  changeType: (payload: "inbox" | "unplaced") => void
}) => {
  const { t } = useTranslation()
  return (
    <BaseModal modal={$$typeModal}>
      <div className="flex w-[280px] cursor-pointer flex-col gap-y-1 rounded-[5px] bg-main p-3">
        {types.map(({ type, iconName }, id) => {
          const active = type == currentType
          return (
            <Button
              key={id}
              size={"xs"}
              onClick={() => changeType(type)}
              className={`text-left ${
                active && "pointer-events-none block w-full bg-cFocus"
              }`}
              intent={"primary"}
            >
              <Icon
                name={iconName}
                className={`mr-4 h-5 w-5 text-accent ${
                  active && "text-cHover"
                }`}
              />
              {t(`task.${type}`)}
            </Button>
          )
        })}
      </div>
    </BaseModal>
  )
}
