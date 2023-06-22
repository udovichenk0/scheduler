import { cva, VariantProps } from "class-variance-authority";
import clsx from 'clsx';
import { ButtonHTMLAttributes, ReactNode } from "react";

export const buttonCva = cva('outline-none rounded-[5px] transition-colors duration-150', {
  variants: {
    intent: {
      outline: [
        "border-[1px]",
        "border-cSecondBorder",
        "hover:bg-cHover",
      ],
      primary: [
        "hover:bg-cHover",
        "text-primary",
        "text-sm"
      ],
      secondary: [
        "hover:bg-cHover",
        "text-cOpacitySecondFont",
        "text-[12px]"
      ],
      filled: [
        "bg-cButtonBg",
        "hover:bg-cButtunHover",
        "text-cButtonText"
      ],
    },
    size: {
      xs: ["p-1"],
      sm: ["py-1", "px-2"],
      base: ["py-2", "px-4"],
      m: ["py-2", "px-5"],
      lg: ["py-3", "px-6"]
    },
  },
  defaultVariants: {
    intent: 'outline'
  }
})
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
    icon?: ReactNode,
    title?: string,
}
export const Button = ({ intent, size, icon, title, ...props }: ButtonProps) => {
  const { className, ...rest } = props
  return (
    <>
      <button className={clsx(buttonCva({ size, intent }), className)} {...rest}>
        <div className='flex gap-4 items-center jusfity-center'>
          {!!icon && icon } {title}
        </div>
      </button>
    </>
  )
}