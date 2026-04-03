import { cva } from "class-variance-authority"

const baseclassname =
  "focus-visible:ring ring-cBorder focus:z-50 focus-visible:outline-none outline-none rounded-[5px] transition-colors duration-150 cursor-pointer text-cFont"

const baseintent = {
  primary: ["hover:bg-hover", "text-primary"],
  filled: ["bg-accent", "hover:brightness-105", "text-cButtonText"],
  borderOutline: ["border border-transparent hover:border-cBorder"],
  base: [],
}

export const buttonCva = cva(baseclassname, {
  variants: {
    intent: baseintent,
    size: {
      xs: ["text-xs", "px-2", "py-1"],
      sm: ["text-sm", "px-3", "py-1.5"],
      base: ["text-sm", "px-4", "py-2"],
      m: ["text-base", "px-5", "py-2.5"],
      lg: ["text-base", "px-6", "py-3"],

      sxs: ["text-sm", "p-1", "leading-none"],
      ssm: ["text-sm", "p-2", "leading-none"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
})
