import { ReactNode, isValidElement, cloneElement, ReactElement, Children } from 'react'
export function Tabs({
	children,
	onChange,
}:{
	children: ReactNode,
	onChange: (ind: number) => void,
}){
	const childrenWithProps = Children.map(children, child => {
		if(isValidElement(child)){
			return cloneElement(child as ReactElement, {onClick: () => onChange(child.props.label)})
		}
		return child
	})

	return <>{childrenWithProps}</>
}