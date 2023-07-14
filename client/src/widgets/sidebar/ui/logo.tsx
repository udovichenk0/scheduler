import { Icon } from "@/shared/ui/icon"

export const Logo = () => {
  return (
    <div className="relative z-10 bg-gradient-to-tr from-accent to-[#aa00ff] flex items-center justify-center h-[22px] w-[22px] rounded-full after:w-[16px] after:h-[16px] after:absolute after:left-[3px] after:top-[3px] after:rounded-full after:bg-[#0d1828]">
      <Icon name="common/done" className="relative w-[8px] h-[8px] z-20 fill-white"/>
    </div>
  )
}