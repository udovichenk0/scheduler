import { clsx } from "clsx"
import {
  ChangeEvent,
  KeyboardEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  ClipboardEvent,
} from "react"

import { onMount } from "@/shared/lib/react"

interface CodeInputProps {
  length: number
  onChange: (value: string) => void
  value: Nullable<string>
  label?: string
  autoFocus?: boolean
  containerStyle?: string
  inputStyle?: string
}

export const CodeInput = forwardRef(
  (
    {
      autoFocus,
      onChange,
      containerStyle,
      inputStyle,
      length,
      label,
    }: CodeInputProps,
    ref,
  ) => {
    const inputRefs = useRef<HTMLInputElement[]>([])
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRefs.current.length) {
          inputRefs.current[0].focus()
        }
      },
      clear: () => {
        {
          inputRefs.current = []
        }
      },
    }))
    onMount(() => {
      if (autoFocus) {
        inputRefs.current[0].focus()
      }
    })
    const sendValue = () => {
      const value = inputRefs.current.map((input) => input.value).join("")
      onChange(value)
    }
    const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { value, nextElementSibling },
      } = event
      if (value.length > 1) {
        event.target.value = value.charAt(0)
        if (nextElementSibling) {
          (nextElementSibling as HTMLInputElement).focus()
        }
      } else {
        if (value.match("[0-9]{1}")) {
          if (nextElementSibling) {
            (nextElementSibling as HTMLInputElement).focus()
          }
        } else {
          event.target.value = ""
        }
      }
      sendValue()
    }
    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement
      const { key } = event
      if (key === "Backspace") {
        if (target.previousSibling && !target.value) {
          const prevTarget = target.previousSibling as HTMLInputElement
          prevTarget.focus()
          prevTarget.value = ""
        }
      }
    }

    const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
      const clipboard = event.clipboardData.getData("Text")
      clipboard.split("").forEach((letter, i) => {
        if (inputRefs.current[i]) {
          if (letter.match("[0-9]{1}")) {
            inputRefs.current[i].value = letter
          } else {
            inputRefs.current[i].value = ""
          }
        }
        event.preventDefault()
      })
      sendValue()
    }

    const inputs = Array.from({ length })
    return (
      <label className={"text-start"}>
        <label className="text-[12px] text-grey">{label}</label>
        <div className={clsx("flex", containerStyle)}>
          {inputs.map((_, i) => {
            return (
              <input
                className={clsx("text-center outline-none", inputStyle)}
                type="tel"
                onKeyDown={onKeyDown}
                onPaste={onPaste}
                key={i}
                inputMode="numeric"
                disabled={false}
                ref={(element) => {
                  inputRefs.current[i] = element as HTMLInputElement
                }}
                onChange={onChangeValue}
              />
            )
          })}
        </div>
      </label>
    )
  },
)
