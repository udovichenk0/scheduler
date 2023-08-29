import { RefObject } from "react"

import { onClickOutside } from "@/shared/lib/on-click-outside"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"

const types = [
  { type: "inbox" , iconName: "common/inbox" },
  { type: "unplaced" , iconName: "common/inbox" },
] as const

export const TypeModal = ({
  closeTypeModal,
  outRef,
  currentType,
  changeType,
}: {
  closeTypeModal: () => void
  outRef: RefObject<HTMLDivElement>
  currentType: "inbox" | "unplaced"
  changeType: (payload: "inbox" | "unplaced") => void
}) => {
  return (
    <>
      <div
        onClick={(e) => onClickOutside(outRef, e, closeTypeModal)}
        className="absolute left-0 top-0 z-10 h-full w-full bg-black/50"
      />
      <div
        ref={outRef}
        className="absolute z-[11] inline-flex w-[280px] -translate-y-[30px] cursor-pointer flex-col gap-1 rounded-[5px] bg-main p-3"
      >
        {types.map(({ type, iconName }, id) => {
          const active = type == currentType
          return (
            <Button
              key={id}
              size={"xs"}
              onClick={() => changeType(type)}
              className={`text-left ${
                active && "pointer-events-none bg-cFocus"
              }`}
              intent={"primary"}
            >
              <Icon
                name={iconName}
                className={`mr-4 h-5 w-5 text-accent ${
                  active && "text-cFocusSecond"
                }`}
              />
              {type}
            </Button>
          )
        })}
      </div>
    </>
  )
}
