import { Icon, IconName } from "../icon";

interface TabProps {
	label: number,
	className?: string,
  iconName: IconName,
  title: string,
}

//fix it
export function Tab({label, title, iconName,className, ...props }:TabProps){
  return (
    <button {...props} className={className}>
      <Icon name={iconName} className="w-8 h-8"/>
      <span className="text-inherit">{title}</span>
    </button>
  )
}