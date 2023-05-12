import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, ReactNode } from "react";

const buttonCva = cva('text-white outline-none transition-colors duration-150', {
    variants: {
        intent: {
            outline: [
                "border-[1px]",
                "hover:bg-[#151a2f]",
                "rounded-[5px]"
            ],
            "base-white": [
                "hover:bg-[#0e162e]",
                "rounded-[5px]",
                "w-full"
            ],
            "base-gray": [
                "hover:bg-[#0e162e]",
                "rounded-[5px]",
                "text-white/50",
                "w-full"
            ]
        },
        size: {
            base: ["text-sm", "p-1"],
            small: ["text-[12px]", "py-1", "px-2"],
            medium: ["text-sm", "py-1", "px-2"],
            large: ["text-sm", "py-3", "px-6"],
        },
    },
    defaultVariants: {
        intent: 'outline'
    }
})
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
        icon?: ReactNode,
    title?: string
}
export const Button = ({ intent, size, icon, title, ...props }: ButtonProps) => {
    return (
        <button className={buttonCva({ size, intent })} {...props}>
            <div className="flex gap-4 items-center jusfity-center">
                {!!icon && icon } {title}
            </div>
        </button>
    )
}