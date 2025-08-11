import { clsx } from "clsx"
import { SVGProps } from "react"

import { SpritesMap } from "./sprite.gen"

export type IconName = {
  [Key in keyof SpritesMap]: `${Key}/${SpritesMap[Key]}`
}[keyof SpritesMap]

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "name" | "type"> {
  name: IconName
}
export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      className={clsx(
        "box-content inline-block select-none fill-current text-inherit",
        className,
      )}
      focusable="false"
      aria-hidden
      {...props}
    >
      <use href={`/sprites/sprite.svg#${name}`} />
    </svg>
  )
}
