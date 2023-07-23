import { clsx } from "clsx"
import { InputHTMLAttributes, ReactNode, forwardRef } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon? : ReactNode,
  type?: 'text' | 'password',
  label?: string,
  error?: string | null
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({icon, type, label, className, disabled, error, value, ...rest}, ref) => {
  return (
    <label className={clsx("relative w-full flex flex-col", className)}>
      <label className="text-left text-grey text-[12px]">{label}</label>
        <input 
          {...rest}
          ref={ref}
          type={type} 
          disabled={disabled} 
          value={value} 
          className={`flex items-center text-sm w-full hover:border-cHover focus:border-cHover outline-none ${error && 'text-error'} pr-8 bg-transparent pb-1 border-b-[1px] border-cSecondBorder`} />
        {icon && (
          <span className="absolute right-0 bottom-1">
            {icon}
          </span>
        )}
      { error && (
        <span className="text-error h-[0px] relative text-sm">{error}</span>
      )}
    </label>
  )
})