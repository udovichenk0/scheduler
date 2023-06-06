import { Link } from "atomic-router-react"
import { routes } from "@/shared/config/router"

export const Home = () => {
	return (
			<div className="">
				<Link to={routes.inbox}>
					go 
				</Link>
			</div>
	)
}