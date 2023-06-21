import { RouteInstance, RouteParams } from "atomic-router"
import { Link } from "atomic-router-react"
import { Icon, IconName } from "../../icon"

export const MainButton = ({title, route, icon}:{title: string, route?: RouteInstance<RouteParams>, icon: IconName}) => {
  return (
    <>
      {route?
        <Link to={route}>
          <div className='flex gap-4 text-sm py-1 px-2 items-center jusfity-center text-primary outline-none transition-colors duration-150 hover:bg-cHover rounded-[5px]'>
            <Icon name={icon} className="fill-accent h-[20px] w-[20px]"/> 
            {title}
          </div>
        </Link>
        : <button>
          <div className={`flex gap-4 text-sm py-1 px-2 items-center jusfity-center text-primary outline-none transition-colors duration-150 hover:bg-cHover rounded-[5px]`}>
            <Icon name={icon} className="fill-accent h-[20px] w-[20px]"/> 
            <span>{title}</span>
          </div>
        </button>
      }
    </>
  )
}
