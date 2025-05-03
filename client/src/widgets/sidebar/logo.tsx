import { Icon } from "@/shared/ui/icon"

export const Logo = () => {
  return (
    <div className="from-accent to-purple relative z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-tr after:absolute after:left-[3px] after:top-[3px] after:h-[16px] after:w-[16px] after:rounded-full after:bg-[#0d1828]">
      <Icon
        name="common/done"
        className="relative z-20 h-[8px] w-[8px] fill-white"
      />
    </div>
  )
}
