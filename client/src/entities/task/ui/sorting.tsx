import { t } from "i18next"
import { useTranslation } from "react-i18next"
import { useRef } from "react"

import { Tooltip } from "@/shared/ui/general/tooltip"
import { Button } from "@/shared/ui/buttons/main-button"
import { Icon } from "@/shared/ui/icon"
import { Modal } from "@/shared/ui/modal"
import { useDisclosure } from "@/shared/lib/modal/use-disclosure"
import { ModalName } from "@/shared/lib/modal/modal-names"

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

  return (
    <div className="relative">
      {sorting && (
        <div>
          <Tooltip text={t("sort.title")} dir="bl">
            <Button
              ref={ref}
              aria-label="Choose sorting method"
              style={{ pointerEvents: isSortModalOpened ? "none" : "unset" }}
              intent={"primary"}
              size={"xs"}
              onClick={() => onOpenSortModal()}
            >
              <Icon
                name={`sort/${sorting.active}`}
                className="text-cIconDefault text-2xl"
              />
            </Button>
          </Tooltip>
          <Modal
            label="Sort tasks"
            isOpened={isSortModalOpened}
            closeModal={onCloseSortModal}
          >
            <Modal.Body className="z-100 absolute right-0 top-full mt-5">
              <TaskSortingPopup
                onChange={(value) => {
                  sorting.onChange(value)
                  onCloseSortModal()
                  ref.current?.focus()
                }}
                config={sorting.config}
                active={sorting.active}
              />
            </Modal.Body>
          </Modal>
        </div>
      )}
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
    <div className="bg-main right-0 z-[1000] flex w-[215px] flex-col">
      {config.map(({ value, label }, id) => {
        return (
          <button
            autoFocus={id == 0}
            key={value}
            className={`hover:bg-hover py-3 pl-8 pr-4  text-left text-[12px] focus-visible:ring ${
              value === active && "bg-hover"
            }`}
            onClick={() => onChange(value)}
          >
            {t(label)}
          </button>
        )
      })}
    </div>
  )
}
