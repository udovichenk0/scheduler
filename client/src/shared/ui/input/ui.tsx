import { InputHTMLAttributes, ReactNode, forwardRef } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon? : ReactNode,
  type?: 'text' | 'password',
  label?: string,
  error?: string | null
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({icon, type, label, disabled, error, value, ...rest}, ref) => {
  return (
    <label className="w-full flex flex-col">
      <span className="text-left text-grey text-[12px]">{label}</span>
        <input 
          {...rest}
          ref={ref}
          type={type} 
          disabled={disabled} 
          value={value} 
          className={`relative flex items-center text-sm w-full hover:border-cHover focus:border-cHover outline-none ${error && 'text-error'} pr-8 bg-transparent pb-1 border-b-[1px] border-cSecondBorder`} />
        <span className="absolute right-0">{icon}</span>
    </label>
  )
})