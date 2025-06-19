import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { useRef } from "react"

import { Tooltip } from "@/shared/ui/general/tooltip"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Modal } from "@/shared/ui/modal"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"
import { ModalName } from "@/shared/lib/disclosure/disclosure-names"

import { SortConfig, SortType } from "../type"
type SortProps = {
  config: SortConfig[]
  active: SortType
  onChange: (value: SortType) => SortType
}
export const Sort = ({ sorting }: { sorting?: SortProps }) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const {
    isOpened: isSortModalOpened,
    open: onOpenSortModal,
    close: onCloseSortModal,
  } = useDisclosure({ id: ModalName.SortModal })

  if(!sorting){
    return null
  }
  return (
    <div className="relative">
      <Modal
        label="Sort tasks"
        portal={false}
        overlay={false}
        isOpened={isSortModalOpened}
        closeModal={onCloseSortModal}
      >
      <Tooltip text={t("sort.title")} dir="bl">
        <Button
          ref={ref}
          aria-label="Choose sorting method"
          style={{ pointerEvents: isSortModalOpened ? "none" : "unset" }}
          intent={"primary"}
          size={"xs"}
          onClick={() => onOpenSortModal()}>
            <Icon
              name={`sort/${sorting.active}`}
              className="text-cIconDefault text-2xl"
            />
          </Button>
        </Tooltip>
        <Modal.Content className="p-2 w-[215px] z-100 top-full -translate-x-2/3">
          <TaskSortingPopup
            onChange={(value) => {
              sorting.onChange(value)
              onCloseSortModal()
              ref.current?.focus()
            }}
            config={sorting.config}
            active={sorting.active}
          />
        </Modal.Content>
      </Modal>
    </div>
  )
}
const TaskSortingPopup = ({
  config,
  onChange,
  active,
}: {
  config: SortConfig[]
  onChange: (value: SortType) => void
  active: SortType
}) => {
  return (
    <>
      {config.map(({ value, label }, id) => {
        return (
          <button
            autoFocus={id == 0}
            key={value}
            className={`hover:bg-hover rounded-md duration-100 py-3 px-4 w-full text-left text-[12px] focus-visible:ring ${
              value === active && "bg-hover"
            }`}
            onClick={() => onChange(value)}
          >
            {t(label)}
          </button>
        )
      })}
    </>
  )
}
