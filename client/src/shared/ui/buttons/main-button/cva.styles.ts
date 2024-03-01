import { cva } from "class-variance-authority"

export const buttonCva = cva(
  "outline-none rounded-[5px] transition-colors duration-150",
  {
    variants: {
      intent: {
        outline: ["border", "border-cSecondBorder", "hover:bg-cHover"],
        primary: ["hover:bg-cHover", "text-primary"],
        accent: ["hover:bg-cHover", "text-accent"],
        filled: ["bg-cButtonBg", "hover:bg-cButtunHover", "text-cButtonText"],
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
