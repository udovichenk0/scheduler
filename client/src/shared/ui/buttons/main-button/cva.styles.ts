import { cva } from "class-variance-authority"

export const buttonCva = cva(
  "focus-visible:ring focus:z-50 focus-visible:outline-none outline-none rounded-[5px] transition-colors duration-150",
  {
    variants: {
      intent: {
        outline: ["border", "border-cSecondBorder", "hover:bg-hover"],
        primary: ["hover:bg-hover", "text-primary"],
        accent: ["hover:bg-hover", "text-accent"],
        filled: ["bg-cButtonBg", "hover:bg-hover", "text-cButtonText"],
        base: []
      },
      size: {
        xs: ["p-1 text-[14px]"],
        sm: ["py-1", "px-2"],
        base: ["py-2", "px-4"],
        m: ["py-2", "px-5"],
        lg: ["py-3", "px-6"],
      },
    },
    defaultVariants: {
      intent: "outline",
    },
  },
)
