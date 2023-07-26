import { DoneSvg } from "./done.svg"
import "./style.css"
export function Checkbox({
  onChange,
  status,
}: {
  onChange: () => void
  status: "FINISHED" | "INPROGRESS"
}) {
  return (
    <div className="relative flex">
      <input
        onChange={() => onChange()}
        checked={status == "FINISHED" ? true : false}
        type="checkbox"
        id="checkbox"
        className="h-5 w-5 appearance-none rounded-[2px] border-[3px] border-cTaskEditDefault"
      />
      <span
        id="check"
        className="pointer-events-none absolute left-[4px] top-[4px] hidden"
      >
        <DoneSvg />
      </span>
    </div>
  )
}
