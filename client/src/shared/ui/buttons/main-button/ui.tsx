//@ts-ignore
import { RouteInstance, RouteParams } from 'atomic-router';
//@ts-ignore
import { Link } from 'atomic-router-react'

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
            ],
            "blue-filled": [
                "bg-[#2384b9]",
                "rounded-[5px]",
                "hover:bg-[#1e6795]"
            ]
        },
        size: {
            base: ["text-sm", "p-1"],
            small: ["text-sm", "py-1", "px-2"],
            medium: ["text-sm", "py-2", "px-4"],
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
    title?: string,
    route?: any // fix
}
export const Button =({ intent, size, icon, title, route, ...props }: ButtonProps) => {
    return (
        <>
            {route?
            <Link to={route} className={buttonCva({ size, intent })}>
                <div className='flex gap-4 items-center jusfity-center'>
                    {!!icon && icon } {title}
                </div>
            </Link>
            : <button className={buttonCva({ size, intent })} {...props}>
                <div className='flex gap-4 items-center jusfity-center'>
                    {!!icon && icon } {title}
                </div>
            </button>
            }
        </>
    )
}