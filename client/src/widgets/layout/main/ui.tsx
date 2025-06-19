import { ReactNode } from "react"

import { Header } from "@/widgets/header/header.tsx"
import { Footer } from "@/widgets/footer"

import { Content } from "./ui/content"
type PropsType = {
  children: ReactNode
  title?: string
}

export const Layout = ({ children, title }: PropsType) => {
  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
      {title && <title>{title}</title>}
      {children}
    </div>
  )
}

Layout.Header = Header
Layout.Content = Content
Layout.Footer = Footer
