import { HTMLAttributes, useEffect, useRef, useState } from "react";

import { isEnter } from "@/shared/lib/key-utils";

type EditableContentProps = {
  onSave: (str: string) => void, 
  content: string, 
  placeholder?: string
} & HTMLAttributes<HTMLDivElement>

export const EditableContent = ({ onSave: onSave, content, placeholder, ...rest }: EditableContentProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(content)

  useEffect(() => {
    if(!value && contentEditableRef.current){
      const el = contentEditableRef.current as HTMLDivElement
      el.textContent = ""
    }
  }, [value]);

  return (
    <div
      ref={contentEditableRef}
      data-placeholder={placeholder}
      suppressContentEditableWarning 
      className="outline-none empty:before:content-[attr(data-placeholder)] px-2 max-h-24 overflow-y-auto before:text-cOpacitySecondFont before:text-sm before:font-light text-sm break-words whitespace-pre-wrap"
      contentEditable
      onBlur={() => {
        onSave(value)
      }}
      onInput={(e) => {
        const target = e.target as HTMLDivElement
        const text = target.textContent || ""
        setValue(text)
      }}
      onKeyDown={(e) => {
        if(isEnter(e) && e.ctrlKey){
          setValue((value) =>  value + "\n")
        }
      }}
      {...rest}
      >
        {content}
    </div>
  )
}