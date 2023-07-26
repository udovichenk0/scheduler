export const DisableButton = ({
  // rename
  disabled,
}: {
  disabled: boolean
}) => {
  return (
    <button
      disabled={disabled}
      className={`rounded-[5px] bg-[#2384b9] text-white outline-none transition-colors duration-150 ${
        disabled ? "bg-[#27658f]" : "hover:bg-[#1e6795]"
      } px-6 py-2 text-sm`}
    >
      Resume
    </button>
  )
}
