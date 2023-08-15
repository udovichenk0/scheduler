import { clsx } from "clsx"
import { InputHTMLAttributes, ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode
  type?: "text" | "password"
  label?: string
  error?: Nullable<string>
  autoFocus?: boolean
}
type InputRef = {
  focus: () => void,
}
export const Input = forwardRef<InputRef, InputProps>(
  ({ icon, autoFocus = false, type, label, className, disabled, error, value, ...rest }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
      useImperativeHandle(ref, () => ({
        focus: () => {
          if(inputRef.current) {
            inputRef.current.focus()
          }
        },
      }))
    useEffect(() => {
      if(autoFocus && inputRef.current){
        inputRef.current.focus()
      }
    }, [])
    return (
      <label className={clsx("relative flex w-full flex-col", className)}>
        <label className="text-left text-[12px] text-grey">{label}</label>
        <input
          {...rest}
          ref={inputRef}
          type={type}
          disabled={disabled}
          value={value}
          className={`flex w-full items-center text-sm outline-none hover:border-cHover focus:border-cHover ${
            error && "text-error"
          } border-b-[1px] border-cSecondBorder bg-transparent pb-1 pr-8`}
        />
        {icon && <span className="absolute bottom-1 right-0">{icon}</span>}
        {error && (
          <span className="relative h-[0px] text-sm text-error">{error}</span>
        )}
      </label>
    )
  },
)
