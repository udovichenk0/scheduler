import { VariantProps, cva } from "class-variance-authority"
import { ButtonHTMLAttributes } from "react"
import { Icon, IconName } from "../../icon"


const iconCva = cva('outline-none transition-colors duration-150 rounded-[5px]', {
  variants: {
    intent: {
      leftBottonPanel: [
        "hover:bg-cHover", "text-cLeftBottomPanel"
      ],
      primary: [
        "hover:bg-cHover", "text-primary",
      ]
    },
    size: {
      base: ['h-[20px] w-[20px] px-1 py-2'],
      m: ['px-3 py-2']
    },
  },
})
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>,
VariantProps<typeof iconCva> {
  iconName: IconName,
}
// change with using cva
export const IconButton = ({
  iconName,
  intent,
  size,
  ...props
}:ButtonProps) => {
  return (
    <button className={iconCva({intent})} {...props}>
      <Icon name={iconName} className={iconCva({size})}/>
    </button>
  )
}