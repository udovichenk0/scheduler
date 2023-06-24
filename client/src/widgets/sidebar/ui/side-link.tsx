import { RouteInstance, RouteParams } from "atomic-router"
import { Link } from "atomic-router-react"
import { buttonCva } from "@/shared/ui/buttons/main-button"
import { Icon, IconName } from "@/shared/ui/icon"

export const SideLink = ({
  title,
  iconName,
  route
}: {
  title: string,
  iconName:IconName,
  route: RouteInstance<RouteParams>
}) => {
  return (
    <Link to={route} activeClassName="bg-cFocus" className={buttonCva({intent: 'primary', size: 'sm'})}>
      <div className='flex gap-4 items-center jusfity-center'>
        <Icon name={iconName} className="fill-accent h-[20px] w-[20px]"/>
        {title}
      </div>
    </Link>
  )
}