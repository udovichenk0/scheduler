import { ReactNode, RefObject, useEffect, useRef, useState } from "react"
import clsx from "clsx"

import { SDate } from "@/shared/lib/date/lib"
import { useDisclosure } from "@/shared/lib/disclosure/use-disclosure"

import { Modal } from "../../modal"
import { parseDateInput } from "../lib"
import { formatDate } from "../formator"
import { Hint } from "../type"

type DateInputProps = {
  placeholder: string
  icon?: ReactNode
  onClick?: () => void
  onSelectDate: (date: SDate) => void
  value: Nullable<SDate>
  className?: string
  ref?: RefObject<Nullable<HTMLInputElement>>
}

export const DateInput = ({
  placeholder,
  icon,
  onClick,
  onSelectDate,
  value,
  className,
  ref,
}: DateInputProps) => {
  const dialog = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState(value ? formatDate(value) : "")
  const [hints, setHints] = useState<Hint[]>([])
  const { open, close, isOpened } = useDisclosure({ prefix: "date-hint" })

  const handleInput = (str: string) => {
    try {
      const hints = parseDateInput(str)
      setInput(str)
      if (!hints.length) {
        if (isOpened) {
          close()
          setHints([])
        }
      } else {
        setHints(hints)
        if (!isOpened) {
          open()
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSelect = (hint: { date: SDate; hint: string }) => {
    setInput(hint.hint)
    onSelectDate(hint.date)
    close()
  }

  useEffect(() => {
    setInput(value ? formatDate(value) : "")
  }, [value])

  useEffect(() => {
    const onBlur = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !dialog.current?.contains(target) &&
        !inputRef.current?.contains(target)
      ) {
        setInput(value ? formatDate(value) : "")
      }
    }
    document.addEventListener("mousedown", onBlur)
    return () => {
      document.removeEventListener("mousedown", onBlur)
    }
  }, [value])

  return (
    <div ref={inputRef} className="z-100 relative w-full">
      <div
        className={clsx(
          "ring-cSecondBorder bg-main-light group flex rounded-md px-2 focus-within:ring",
          className,
        )}
      >
        {icon && <div className="mr-0.5">{icon}</div>}
        <input
          ref={ref}
          type="text"
          onClick={onClick}
          placeholder={placeholder}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          className="text-cFont px-2 py-1 text-sm"
        />
      </div>
      <Modal
        label="Select date"
        isOpened={isOpened}
        portal={false}
        overlay={false}
        closeModal={close}
      >
        <Modal.Content className="mt-2 w-full">
          <div
            ref={dialog}
            className="bg-main-dark text-cFont top-full flex max-h-80 w-full flex-col items-start overflow-y-auto rounded-lg shadow-lg"
          >
            {hints.map((hint) => (
              <button
                onClick={() => onSelect(hint)}
                className="hover:bg-main-light w-full cursor-pointer rounded-md px-2 py-1.5 text-start text-sm"
                key={hint.hint}
              >
                {hint.hint}
              </button>
            ))}
          </div>
        </Modal.Content>
      </Modal>
    </div>
  )
}
