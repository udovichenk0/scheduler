import { HTMLAttributes } from "react"

type ToggleProps = HTMLAttributes<HTMLDivElement> & {
  checked: boolean
}

export const Toggle = (props: ToggleProps) => {
  const {onChange, checked, ...rest} = props
  return (
    <label className="focus-visible:hidden">
      <input type="checkbox" onChange={onChange} checked={checked} className="sr-only peer" />
      <div {...rest} className="peer-focus-visible:ring relative peer-checked:bg-accent/60 bg-cOpacitySecondFont h-4 w-8 overflow-hidden rounded-md transition duration-200 after:absolute after:content-'' after:h-full after:aspect-[1/1] after:rounded-md after:bg-accent/90 peer-checked:after:translate-x-full after:transition-transform"></div>
    </label>
  )
}