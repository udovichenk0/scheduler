import { useUnit } from "effector-react"

import { $$session } from "@/entities/session/session.model.ts"

import { Typography } from "@/shared/ui/general/typography"

import { submitTriggered } from "./logout.model"

export const Logout = () => {
  const user = useUnit($$session.$user)
  const submit = useUnit(submitTriggered)

  return (
    <div className="text-cFont">
      <Typography.Heading size="base" className="mb-3 text-lg font-medium">
        Logout
      </Typography.Heading>
      <span className="mb-3">{user?.email}</span>
      <button
        onClick={submit}
        className="w-[132px] rounded-[5px] bg-[#2384b9] py-1 text-sm text-white outline-none transition-colors duration-150 hover:bg-[#1e6795]"
      >
        Quit
      </button>
    </div>
  )
}
