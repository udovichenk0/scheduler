import { HTMLAttributes } from "react"

type ToggleProps = HTMLAttributes<HTMLDivElement> & {
  checked: boolean
}

export const Toggle = (props: ToggleProps) => {
  const { onChange, checked, ...rest } = props
  return (
    <label className="focus-visible:hidden">
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        className="peer sr-only"
      />
      <div
        {...rest}
        className="peer-checked:bg-accent/60 bg-cOpacitySecondFont after:content-'' after:bg-accent/90 relative h-4 w-8 overflow-hidden rounded-md transition duration-200 after:absolute after:aspect-[1/1] after:h-full after:rounded-md after:transition-transform peer-checked:after:translate-x-full peer-focus-visible:ring"
      ></div>
    </label>
  )
}
