import {cva, VariantProps} from "class-variance-authority";
import {ButtonHTMLAttributes} from "react";

const buttonCva = cva('', {
    variants: {
        intent: {
            primary: [
                "text-white",
                "border-[1px]",
                "hover:bg-[#151a2f]",
                "transition-colors duration-150",
                "rounded-[5px]"
            ],
            // **or**
            // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: [
                "bg-white",
                "text-gray-800",
                "border-gray-400",
                "hover:bg-gray-100",
            ],
        },
        size: {
            medium: ["text-sm", "py-2", "px-5"],
        },
    },

})
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCva> {
}
export const Button = ({intent, size, ...props}: ButtonProps) => {
    return (
        <button className={buttonCva({size: "medium", intent: "primary"})} {...props}/>
    )
}