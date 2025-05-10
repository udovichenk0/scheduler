import { ReactNode, RefObject, useEffect, useRef, useState } from "react"
import dayjs from "dayjs"
import clsx from "clsx"

import { useDisclosure } from "@/shared/lib/modal/use-disclosure"

import { Modal } from "../../modal"
import {
  parseDateInput,
} from "../lib"
import { formatDate } from "../formator"
import { Hint } from "../type"

type DateInputProps = {
  placeholder: string
  icon?: ReactNode
  onClick?: () => void
  onSelectDate: (date: Date) => void
  value: Nullable<Date>
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
  ref
}: DateInputProps) => {
  const dialog = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState(value ? formatDate(dayjs(value)) : "")
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

  const onSelect = (hint: { date: dayjs.Dayjs; hint: string }) => {
    setInput(hint.hint)
    onSelectDate(hint.date.toDate())
    close()
  }

  useEffect(() => {
    setInput(value ? formatDate(dayjs(value)) : "")
  }, [value])

  useEffect(() => {
    const onBlur = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if(!dialog.current?.contains(target) && !inputRef.current?.contains(target)){
        setInput(value ? formatDate(dayjs(value)) : "")
      }
    }
      document.addEventListener("mousedown", onBlur)
    return () => {
      document.removeEventListener("mousedown", onBlur)
    }
  }, [value])

  return (
    <div ref={inputRef} className="relative w-full">
      <div className={clsx("ring-cSecondBorder bg-main-light group flex rounded-md px-2 focus-within:ring", className)}>
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
        className="border-0!"
        closeModal={close}
      >
        <Modal.Body className="border-0!">
          <div ref={dialog} className="bg-main-dark max-h-80 overflow-y-auto z-100 text-cFont absolute top-full mt-2 flex w-full flex-col items-start rounded-lg p-2 shadow-lg">
            {hints.map((hint) => (
              <button
                onClick={() => onSelect(hint)}
                className="w-full cursor-pointer hover:bg-main-light rounded-md px-2 py-1.5 text-start text-sm"
                key={hint.hint}
              >
                {hint.hint}
              </button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}