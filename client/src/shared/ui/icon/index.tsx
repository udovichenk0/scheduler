import clsx from "clsx"
import { sprites, type SpritesMeta } from "./sprite.gen"
import { CSSProperties } from "react"

// Type-safe icon name: "sprite:symbol"
export type IconName = {
  [Key in keyof SpritesMeta]: `${Key}/${SpritesMeta[Key]}`
}[keyof SpritesMeta]

export function Icon({
  name,
  className,
  style,
}: {
  name: IconName
  className?: string
  style?: CSSProperties
}) {
  const [spriteName, iconName] = name.split("/")
  const item = sprites.experimental_get(spriteName, iconName, {
    baseUrl: "/sprites/",
  })
  if (!item) return null
  const { symbol, href } = item
  return (
    <svg
      className={clsx("icon", className)}
      style={style}
      viewBox={symbol.viewBox}
      focusable="false"
      aria-hidden
    >
      <use href={href} />
    </svg>
  )
}
