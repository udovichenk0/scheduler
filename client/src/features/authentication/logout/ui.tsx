import { useUnit } from "effector-react/compat"
import { $sessionUser } from "@/entities/session/session.model"

export const Logout = () => {
    const user = useUnit($sessionUser)
    return (
        <div>
            <h2 className="text-lg mb-3 font-medium">Logout</h2>
            <h1 className="mb-3">{user?.email || "myemail@gmail.com"}</h1>
            <button className="text-white outline-none w-[132px] text-sm py-1 transition-colors duration-150 bg-[#2384b9] rounded-[5px] hover:bg-[#1e6795]">
                Quit
            </button>
        </div>
    )
}