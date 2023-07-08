import { VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { buttonCva } from "./cva.styles";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
    icon?: ReactNode,
    rightSlot?: ReactNode
    title?: string,
}


export const Button = ({ intent, size, icon, title,rightSlot, ...props }: ButtonProps) => {
  const { className, ...rest } = props
  return (
    <>
      <button className={clsx(buttonCva({ size, intent }), className)} {...rest}>
        <div className='flex items-center jusfity-center'>
          {!!icon && icon } {!!title && <span className='ml-4 mr-2'>{title}</span>} {rightSlot}
        </div>
      </button>
    </>
  )
}