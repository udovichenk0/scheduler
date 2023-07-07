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
        <div className='flex gap-4 items-center jusfity-center'>
          {!!icon && icon } <div className='flex items-center gap-2'>{title} {rightSlot}</div>
        </div>
      </button>
    </>
  )
}