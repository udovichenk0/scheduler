import clsx from "clsx"
import { ReactElement } from "react"
import style from './style.module.css'

export const Grid = ({ 
  columns, 
  rows, 
  className, 
  children 
}: { 
  columns: number, 
  rows: number, 
  className?: string, 
  children: ReactElement[]
}) => {
  return (
    // @ts-ignore
    <div style={{ '--columns': columns, '--rows': rows, '--col': 'red'}} className={clsx(style.grid, className)}>
        <div className={style.items}>
          {Array.from({ length: columns * rows }).map((_, index) => {
            const x = (index % columns) + 1
            const y = Math.floor(index / columns) + 1;
            return (
              // @ts-ignore
              <div key={index} style={{ '--column':x , '--row': y }} className={style.item}/>
            )
          })}
        </div>
        {children}
    </div>
  )
}