import { clsx } from "clsx"
import { InputHTMLAttributes, ReactNode, forwardRef } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode
  type?: "text" | "password"
  label?: string
  error?: string | null
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, type, label, className, disabled, error, value, ...rest }, ref) => {
    return (
      <label className={clsx("relative flex w-full flex-col", className)}>
        <label className="text-left text-[12px] text-grey">{label}</label>
        <input
          {...rest}
          ref={ref}
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
