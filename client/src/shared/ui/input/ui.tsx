interface InputProps {
    onChange: (v: string) => void,
    name: string,
    value: string,
    label: string,
    error?: string | null
}
export const Input = ({
    onChange,
    name,
    value,
    label,
    error
}:InputProps) => {
    return (
        <label className="w-full flex flex-col" htmlFor={name}>
            <span className="text-left text-white/50 text-[12px]">{label}</span>
            <input onChange={(e) => onChange(e.target.value)} value={value} className={`w-full outline-none ${error && 'text-error'} bg-transparent pb-1 border-b-[1px] border-[#76899b]`} type="text" />
        </label>
    )
}