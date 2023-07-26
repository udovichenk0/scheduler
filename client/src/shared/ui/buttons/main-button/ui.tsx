import { VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { buttonCva } from "./cva.styles"

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
  children?: ReactNode
}

export const Button = ({ intent, size, children, ...props }: ButtonProps) => {
  const { className, ...rest } = props
  return (
    <button className={clsx(buttonCva({ size, intent }), className)} {...rest}>
      {/* {!!icon && <span className='mr-4'>{icon}</span>} 
          {title}            
          {!!rightSlot && <span className='ml-2'>{rightSlot}</span>} */}
      {children}
    </button>
  )
}
