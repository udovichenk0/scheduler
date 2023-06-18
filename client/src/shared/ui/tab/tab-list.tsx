import { ReactNode, isValidElement, cloneElement, ReactElement, Children } from 'react'
type TabListType = {
  children: ReactNode,
  onChange: (ind: number) => void,
  className?: string
}
export function TabList({
  children,
  onChange,
  className
}:TabListType){
  const childrenWithProps = Children.map(children, child => {
    if(isValidElement(child)){
      return cloneElement(child as ReactElement, {onClick: () => onChange(child.props.label)})
    }
    return child
  })

  return <div className={className}>{childrenWithProps}</div>
}