import { useUnit } from "effector-react/compat"
import { FormEvent } from "react"
import { createEffect, sample } from "effector"

import { $sessionUser } from "@/entities/session/session.model"

import { Typography } from "@/shared/ui/general/typography"

import { submitTriggered } from "./logout.model"
const submitLogout = (e: FormEvent, submit: () => void) => {
  e.preventDefault()
  submit()
}
const verifyQuery = createEffect(async () => {
  const result = await fetch("http://localhost:3000/auth/verify-email")
  return result.json()
})

sample({
  clock: verifyQuery.done,
  fn: () => console.log('something')
})

export const Logout = () => {
  const [user, submit] = useUnit([$sessionUser, submitTriggered])
  return (
    <div className="text-cFont">
      <Typography.Heading size="base" className="mb-3 text-lg font-medium">
        Logout
      </Typography.Heading>
      <span className="mb-3">{user?.email || "myemail@gmail.com"}</span>
      <form action="" onSubmit={(e) => submitLogout(e, submit)}>
        <button className="w-[132px] rounded-[5px] bg-[#2384b9] py-1 text-sm text-white outline-none transition-colors duration-150 hover:bg-[#1e6795]">
          Quit
        </button>
      </form>
    </div>
  )
}
