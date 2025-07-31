import { cva } from "class-variance-authority"

export const buttonCva = cva(
  "focus-visible:ring focus:z-50 focus-visible:outline-none outline-none rounded-[5px] transition-colors duration-150",
  {
    variants: {
      intent: {
        primary: ["hover:bg-hover", "text-primary"],
        filled: ["bg-cButtonBg", "hover:brightness-125", "text-cButtonText"],
        base: [],
      },
      size: {
        xs: ["text-xs", "px-2", "py-1"],
        sm: ["text-sm", "px-3", "py-1.5"],
        base: ["text-sm", "px-4", "py-2"],
        m: ["text-base", "px-5", "py-2.5"],
        lg: ["text-base", "px-6", "py-3"],
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
)
