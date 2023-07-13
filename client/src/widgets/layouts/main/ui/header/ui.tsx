import { Icon, IconName } from "@/shared/ui/icon"

export const Header = ({icon, title}:{icon: IconName, title: string}) => {
  return (
    <div className="mb-5 px-4 text-primary">
      <div className="py-2">
			Header
      </div>
      <div className="flex gap-4 items-center">
        <Icon name={icon} className="fill-cIconDefault w-5 h-5"/>
        <h1 className="text-[24px]">{title}</h1>
      </div>
    </div>
  )
}