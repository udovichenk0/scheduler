import { ReactNode } from "react"
import { Header } from "@/widgets/header"
import { Content } from "./ui/content"
import { Footer } from "./ui/footer"
type PropsType = {
  children: ReactNode
}

export const Layout = ({ children }: PropsType) => {
  return (
    <div className="grid h-screen w-full grid-rows-[auto_1fr_auto]">
      {children}
    </div>
  )
}

Layout.Header = Header
Layout.Content = Content
Layout.Footer = Footer
