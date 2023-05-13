interface InputProps {
    onChange: (v: string) => void,
    name: string,
    value: string,
    label: string
}
export const Input = ({
    onChange,
    name,
    value,
    label
}:InputProps) => {
    return (
        <label className="w-full flex flex-col" htmlFor={name}>
            <span className="text-left text-white/50 text-[12px]">{label}</span>
            <input onChange={(e) => onChange(e.target.value)} value={value} className="w-full outline-none bg-transparent pb-1 border-b-[1px] border-[#76899b]" type="text" />
        </label>
    )
}