
import { ReactNode, FormEvent } from "react"

import { Button } from "../../buttons/main-button"
import { Typography } from "../../general/typography"
import { Icon } from "../../icon"

type AuthTemplateProps = {
  children: ReactNode,
  title: string,
  subtitle?: string,
  disabled?: boolean,
  onArrowClick: () => void,
  onSubmit: () => void,
  className?: string
}
export const AuthTemplate = ({ children, title, subtitle, onArrowClick, onSubmit, className }: AuthTemplateProps) => {
  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    onSubmit()
  }
  return (
    <div className="relative text-center text-cFont">
      <Button
        className="absolute -left-[20px]"
        onClick={onArrowClick}
        intent={"primary"}
        size={"sm"}
      >
        <Icon
          name="common/arrow"
          className="text-4 rotate-180 text-cIconDefault"
        />
      </Button>
      <Typography.Heading size="base" className="mb-3 font-semibold">
        {title}
      </Typography.Heading>
      <Typography.Paragraph size="sm" className="mb-7">
        {subtitle}
      </Typography.Paragraph>
      
      <form
        className={className}
        onSubmit={(e) => submitForm(e)}
      >
        {children}
      </form>
    </div>
  )
}