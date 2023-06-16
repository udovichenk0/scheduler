export const DisableButton = ({ // rename
  disabled,
}:{
    disabled: boolean,
}) => {
  return (
    <button disabled={disabled} className={`text-white outline-none transition-colors duration-150 bg-[#2384b9] rounded-[5px] ${disabled ? 'bg-[#27658f]' : 'hover:bg-[#1e6795]'} text-sm py-2 px-6`}>
            Resume
    </button>
  )
}