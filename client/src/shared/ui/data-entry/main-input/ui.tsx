import { clsx } from "clsx"
import {
  InputHTMLAttributes,
  ReactNode,
  RefObject,
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
  ref: RefObject<any>
}

export const Input = ({
  icon,
  autoFocus = false,
  type,
  label,
  className,
  disabled,
  error,
  value,
  ref,
  ...rest
}: InputProps) => {
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
      <label className="text-cOpacitySecondFont text-left text-[12px]">
        {label}
      </label>
      <div className="relative mb-3">
        <input
          {...rest}
          ref={inputRef}
          type={type}
          disabled={disabled}
          aria-invalid={!!error}
          value={value}
          className="border-cSecondBorder hover:border-hover focus:border-hover aria-[invalid=true]:text-error flex w-full items-center border-b-[1px]
          bg-transparent py-1 pr-8 text-sm outline-none"
        />
        {icon && <span className="absolute bottom-1 right-0">{icon}</span>}
      </div>
      <div className="h-5">
        {error && <span className="text-error text-sm">{error}</span>}
      </div>
    </label>
  )
}
