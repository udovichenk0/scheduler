import { clsx } from "clsx"
import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"

import { onMount } from "@/shared/lib/react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode
  type?: "text" | "password"
  label?: string
  error?: Nullable<string>
  autoFocus?: boolean
}
type InputRef = {
  focus: () => void
}
export const Input = forwardRef<InputRef, InputProps>(
  (
    {
      icon,
      autoFocus = false,
      type,
      label,
      className,
      disabled,
      error,
      value,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      },
    }))
    onMount(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus()
      }
    })
    return (
      <label className={clsx("flex w-full flex-col", className)}>
        <label className="text-left text-[12px] text-grey">{label}</label>
        <div className="relative mb-3">
          <input
            {...rest}
            ref={inputRef}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            value={value}
            className="flex w-full items-center border-b-[1px] border-cSecondBorder bg-transparent py-1 pr-8
            text-sm outline-none hover:border-cHover focus:border-cHover aria-[invalid=true]:text-error"
          />
          {icon && <span className="absolute bottom-1 right-0">{icon}</span>}
        </div>
        <div className="h-5">
          {error && <span className="text-sm text-error">{error}</span>}
        </div>
      </label>
    )
  },
)
